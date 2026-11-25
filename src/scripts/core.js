// Core: smooth scroll, cursor, page transitions, header, menu, reveals.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// Mobile URL-bar show/hide must not re-measure triggers, and 'load' is left out of the auto-refresh
// list so a late refresh never moves content under the reader.
ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: 'visibilitychange,DOMContentLoaded,resize' });

const html = document.documentElement;
const mq = (q) => matchMedia(q).matches;
export const reduced = mq('(prefers-reduced-motion: reduce)');
const fine = mq('(hover: hover) and (pointer: fine)');

// ---- Lenis -----------------------------------------------------------------
export const lenis = reduced ? null : new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
if (import.meta.env.DEV) window.__rmc = { lenis, gsap, ScrollTrigger };

export const scrollToY = (target, opts = {}) => {
  if (lenis) lenis.scrollTo(target, { duration: 1.1, ...opts });
  else {
    const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY + (opts.offset || 0);
    scrollTo({ top: y, behavior: 'auto' });
  }
};

let closeMenu = null;

// Same-page hash links go through Lenis
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const url = new URL(a.href, location.href);
  if (url.pathname === location.pathname && url.search === location.search && url.hash.length > 1) {
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    closeMenu?.();
    scrollToY(el, { offset: -72 });
    history.replaceState(null, '', url.hash);
  }
});
document.querySelectorAll('[data-top]').forEach((b) => b.addEventListener('click', () => scrollToY(0)));

// ---- Cursor: 24px ring + 6px dot, grows to 40px on links, hidden on touch -------
const cursor = document.getElementById('cursor');
if (fine && !reduced && cursor) {
  html.classList.add('has-cursor');
  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3.out' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3.out' });
  cursor.classList.add('is-off');
  let last = null;
  const update = (t) => {
    if (t === last) return;
    last = t;
    let state = t?.closest?.('a, button, label, summary, [role="button"], [data-cursor="link"]') ? 'link' : '';
    if (t?.closest?.('input:not([type="checkbox"]), textarea, select')) state = 'hide';
    cursor.dataset.state = state;
  };
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    cursor.classList.remove('is-off');
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    update(e.target);
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.add('is-off'));
  addEventListener('blur', () => cursor.classList.add('is-off'));
  addEventListener('scroll', () => { last = null; }, { passive: true });
}

// ---- Page transitions: 0.3s cover out, 0.38s lift in, never waits on media --------
const pt = document.getElementById('pt');
const arriving = html.classList.contains('pt-arrive');
try { sessionStorage.removeItem('rmc:pt'); } catch { /* ignore */ }

const arrive = () => {
  if (!pt) return Promise.resolve();
  return new Promise((res) => {
    const done = () => { html.classList.remove('pt-arrive'); gsap.set(pt, { clearProps: 'all' }); res(); };
    if (reduced) { gsap.to(pt, { opacity: 0, duration: 0.12, onComplete: done }); return; }
    gsap.timeline({ onComplete: done })
      .call(res, null, 0.14)
      .fromTo(pt, { clipPath: 'inset(0% 0 0% 0)' }, { clipPath: 'inset(0% 0 100% 0)', duration: 0.38, ease: 'power3.inOut' }, 0);
  });
};
export const arrived = arriving ? arrive() : Promise.resolve();

const internalUrl = (a, e) => {
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  if ((a.target && a.target !== '_self') || a.hasAttribute('download') || a.dataset.noTransition !== undefined) return null;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || !/^https?:/.test(url.protocol)) return null;
  if (url.pathname === location.pathname && url.search === location.search) return null;
  return url;
};
document.addEventListener('click', (e) => {
  const url = internalUrl(e.target.closest('a[href]'), e);
  if (!url || !pt) return;
  e.preventDefault();
  const go = () => {
    try { sessionStorage.setItem('rmc:pt', '1'); } catch { /* ignore */ }
    document.dispatchEvent(new CustomEvent('rmc:leave'));
    location.href = url.href;
  };
  pt.style.visibility = 'visible';
  if (reduced) { gsap.fromTo(pt, { opacity: 0 }, { opacity: 1, duration: 0.12, onComplete: go }); return; }
  gsap.fromTo(pt, { clipPath: 'inset(100% 0 0% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 0.3, ease: 'power3.inOut', onComplete: go });
});
addEventListener('pageshow', (e) => {
  if (e.persisted && pt) {
    html.classList.remove('pt-arrive');
    gsap.killTweensOf(pt);
    gsap.set(pt, { clearProps: 'all' });
  }
});

// ---- Header -------------------------------------------------------------------
const hdr = document.getElementById('hdr');
if (hdr) {
  let lastY = scrollY;
  let hidden = false;
  const menuOpen = () => document.getElementById('menu')?.classList.contains('is-open');
  // Sections that keep the header (phone + quote button) on screen while they are in view.
  const holds = [...document.querySelectorAll('[data-hold-header]')];
  const holding = () => holds.some((el) => {
    const r = el.getBoundingClientRect();
    return r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5;
  });
  const themed = [...document.querySelectorAll('[data-header-theme]')];
  const setTheme = () => {
    const y = hdr.offsetHeight * 0.5;
    let theme = 'dark';
    for (const s of themed) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) theme = s.dataset.headerTheme;
    }
    if (hdr.dataset.theme !== theme) hdr.dataset.theme = theme;
  };
  const onScroll = (y) => {
    hdr.classList.toggle('is-solid', y > 60);
    setTheme();
    const hold = holding();
    if (!reduced && !menuOpen() && !hdr.contains(document.activeElement)) {
      if (y > lastY + 2 && y > 500 && !hidden && !hold) { hidden = true; gsap.to(hdr, { yPercent: -105, duration: 0.45, ease: 'power3.out' }); }
      else if ((y < lastY - 2 || y < 500 || hold) && hidden) { hidden = false; gsap.to(hdr, { yPercent: 0, duration: 0.45, ease: 'power3.out' }); }
    }
    lastY = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else addEventListener('scroll', () => onScroll(scrollY), { passive: true });
  hdr.addEventListener('focusin', () => { if (hidden) { hidden = false; gsap.to(hdr, { yPercent: 0, duration: 0.3 }); } });
  addEventListener('resize', setTheme);
  onScroll(scrollY);
}

// ---- Mobile menu -----------------------------------------------------------------
const menu = document.getElementById('menu');
const openBtn = document.querySelector('[data-menu-open]');
if (menu && openBtn) {
  const focusables = () => [...menu.querySelectorAll('a[href], button:not([disabled])')];
  const rows = [...menu.querySelectorAll('.menu__nav a, .menu__foot > *')];
  let tl = null;
  const reset = () => {
    menu.hidden = true;
    menu.classList.remove('is-open');
    gsap.set(menu, { clearProps: 'clipPath' });
    gsap.set(rows, { clearProps: 'all' });
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    lenis?.start();
  };
  const open = () => {
    menu.hidden = false;
    menu.classList.add('is-open');
    openBtn.setAttribute('aria-expanded', 'true');
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    if (!reduced) {
      tl?.kill();
      tl = gsap.timeline()
        .fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' })
        .fromTo(rows, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.04 }, 0.22);
    }
    requestAnimationFrame(() => focusables()[0]?.focus());
  };
  closeMenu = () => {
    if (menu.hidden) return;
    tl?.kill();
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    lenis?.start();
    if (reduced) reset();
    else gsap.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.45, ease: 'power3.inOut', onComplete: reset });
    openBtn.focus();
  };
  openBtn.addEventListener('click', open);
  menu.querySelector('[data-menu-close]')?.addEventListener('click', () => closeMenu());
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables();
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  addEventListener('resize', () => { if (innerWidth >= 1100 && !menu.hidden) closeMenu(); });
  // bfcache can restore the page with the menu open and Lenis stopped.
  addEventListener('pageshow', (e) => { if (e.persisted && !menu.hidden) { tl?.kill(); gsap.killTweensOf(menu); reset(); } });
}

// ---- Reveals: transform/opacity (and one clip wipe for photos), start at top 92% ------
const revealOne = (el) => {
  const kind = el.dataset.reveal;
  const delay = +(el.dataset.delay || 0);
  if (kind === 'lines') return gsap.to(el.querySelectorAll('.line > span'), { y: 0, yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07, delay });
  if (kind === 'fade') return gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', delay });
  if (kind === 'rule') return gsap.to(el, { scaleX: 1, duration: 0.8, ease: 'expo.out', delay });
  if (kind === 'photo') {
    const img = el.querySelector('img, video');
    const tl = gsap.timeline({ delay });
    tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power3.inOut' });
    if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 0.8, ease: 'expo.out' }, 0.05);
    return tl;
  }
  return null;
};

// Headings marked data-split are split into real rendered lines once fonts are ready, so each
// line can rise on its own. The text stays the same in the DOM.
const splitLines = (el) => {
  if (el.dataset.splitDone) return;
  const text = el.textContent.replace(/\s+/g, ' ').trim();
  const words = text.split(' ');
  el.textContent = '';
  const spans = words.map((w, i) => {
    const s = document.createElement('span');
    s.style.display = 'inline-block';
    s.textContent = w;
    el.appendChild(s);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    return s;
  });
  const lines = [];
  let top = null;
  spans.forEach((s) => {
    const t = Math.round(s.getBoundingClientRect().top);
    if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; }
    lines[lines.length - 1].push(s.textContent);
  });
  el.textContent = '';
  el.setAttribute('aria-label', text);
  lines.forEach((ws) => {
    const line = document.createElement('span');
    line.className = 'line';
    line.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.textContent = ws.join(' ');
    line.appendChild(inner);
    el.appendChild(line);
  });
  el.dataset.splitDone = '1';
};

export const initReveals = (root = document) => {
  const els = [...root.querySelectorAll('[data-reveal]')].filter((el) => !el.dataset.revealManual);
  if (reduced) return;
  els.forEach((el) => {
    if (el.dataset.reveal === 'lines') splitLines(el);
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => revealOne(el) });
  });
  // Scroll sweep: after a fast scroll or a jump, anything already above the fold line is shown.
  let sweepT = 0;
  const sweep = () => {
    els.forEach((el) => {
      if (el.dataset.swept) return;
      if (el.getBoundingClientRect().top < innerHeight * 0.92) { el.dataset.swept = '1'; revealOne(el); }
    });
  };
  const queue = () => { clearTimeout(sweepT); sweepT = setTimeout(sweep, 140); };
  if (lenis) lenis.on('scroll', queue); else addEventListener('scroll', queue, { passive: true });
};
export { revealOne, splitLines };

// Boot once the fonts that set line breaks are in (bounded: never hold reveals back for long).
const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 900))]);
Promise.all([arrived, fontsReady]).then(() => {
  initReveals();
  html.classList.add('is-ready');
  document.dispatchEvent(new CustomEvent('rmc:ready'));
});

// Refresh only if the page height actually changed after load (late fonts or media).
let measuredH = 0;
ScrollTrigger.addEventListener('refresh', () => { measuredH = html.scrollHeight; });
const refreshIfChanged = () => { if (html.scrollHeight !== measuredH) ScrollTrigger.refresh(); };
if (document.readyState === 'complete') refreshIfChanged();
else addEventListener('load', refreshIfChanged, { once: true });
