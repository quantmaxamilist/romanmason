// The numbered services list beside a wow moment. Its layout never changes: it is only faded in
// when the animation has finished, and hovering a row lights the matching part of the model.
import { gsap } from 'gsap';

export function wowList(root) {
  const stage = root.closest('[data-stage]');
  const list = stage?.querySelector('[data-wow-list]');
  const rows = list ? [...list.querySelectorAll('[data-part]')] : [];
  const replayBtn = root.querySelector('[data-replay]');
  return {
    arm() {
      if (!list) return;
      list.classList.add('is-armed');
      // Safety: if the list has been on screen for a while and the animation has not finished
      // (a very fast scroll past the model, say), show the list anyway. Text is never held hostage.
      let t = 0;
      new IntersectionObserver(([e], io) => {
        clearTimeout(t);
        if (list.classList.contains('is-built')) { io.disconnect(); return; }
        if (e.isIntersecting) t = setTimeout(() => this.built(), matchMedia('(max-width: 62rem)').matches ? 2800 : 5200);
      }, { threshold: 0.25 }).observe(list);
    },
    built() {
      if (list?.classList.contains('is-armed') && !list.classList.contains('is-built')) {
        list.classList.add('is-built');
        gsap.fromTo(rows, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.07, clearProps: 'transform' });
      }
      if (replayBtn) { replayBtn.hidden = false; gsap.fromTo(replayBtn, { opacity: 0 }, { opacity: 1, duration: 0.5 }); }
    },
    onHover(fn) {
      rows.forEach((row) => {
        const on = () => { rows.forEach((r) => r.classList.toggle('is-lit', r === row)); fn(row.dataset.part); };
        const off = () => { row.classList.remove('is-lit'); fn(null); };
        row.addEventListener('pointerenter', on);
        row.addEventListener('pointerleave', off);
        row.addEventListener('focusin', on);
        row.addEventListener('focusout', off);
      });
    },
    onReplay(fn) { replayBtn?.addEventListener('click', fn); },
  };
}
