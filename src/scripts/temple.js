// The signature moment: the temple from the Roman Mason Construction logo, built in stone.
// Every measurement below is read from the logo file (public/brand/logo-full-white.svg, a
// 288.369 × 314.313 drawing): the three steps, the two fluted columns and their Ionic capitals,
// the entablature with its row of dentils, the pediment with "2021", and the square and compasses
// with "RM" in the doorway. It assembles once, by itself, in about four seconds, then a finishing
// pass sweeps across it and turns raw blockwork into a smooth rendered surface.
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { gsap } from 'gsap';

const CX = 144.16; // centre line of the logo
const GROUND = 229.75; // underside of the lowest step
const ZC = 34; // columns stand this far in front of / behind the centre plane
const ENT_D = 128; // depth of the entablature and pediment
const R = 18.2; // column shaft radius (the seven flute strokes span 36.4 units)
const BRICK = 0xb8472a;

const X = (sx) => sx - CX;
const Y = (sy) => GROUND - sy;

export async function mountTemple(root, { onDone } = {}) {
  const canvas = root.querySelector('canvas');
  // The scene is prepared in small slices of idle time so it never causes a hitch while scrolling.
  const pause = () => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(() => r(), { timeout: 120 }) : setTimeout(r, 16)));
  const mobile = matchMedia('(max-width: 720px)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 20, 5000);
  const target = new THREE.Vector3(0, 106, 0);

  // ---- Light ---------------------------------------------------------------------
  scene.add(new THREE.HemisphereLight(0xfff3e2, 0x14110e, 0.42));
  const key = new THREE.DirectionalLight(0xfff0db, 3.3);
  key.position.set(-300, 430, 400);
  key.target.position.copy(target);
  key.castShadow = true;
  const sm = mobile ? 1024 : 2048;
  key.shadow.mapSize.set(sm, sm);
  Object.assign(key.shadow.camera, { left: -300, right: 300, top: 340, bottom: -140, near: 60, far: 1500 });
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.9;
  key.shadow.radius = 5;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xbfcdfb, 0.9);
  rim.position.set(320, 220, -300);
  scene.add(rim);
  const warm = new THREE.PointLight(0xf6c9a4, 0, 420, 1.7); // glows from inside the doorway at the end
  warm.position.set(0, 70, -10);
  scene.add(warm);

  // ---- Stone: one shader, shared by every part ---------------------------------------
  // uSweep is the world-x position of the finishing pass. Ahead of it the stone is raw blockwork
  // (grey, with course joints); behind it, a smooth pale render. A warm band of light rides the edge.
  const sweep = { value: -400 };
  const materials = [];
  const stone = ({ fin = 0xe9e3d6, raw = 0x5b5e62, roughness = 0.88 } = {}) => {
    const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness, metalness: 0, emissive: BRICK, emissiveIntensity: 0 });
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uSweep = sweep;
      sh.uniforms.uRaw = { value: new THREE.Color(raw) };
      sh.uniforms.uFin = { value: new THREE.Color(fin) };
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vRmW;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRmW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vRmW;\nuniform float uSweep;\nuniform vec3 uRaw;\nuniform vec3 uFin;')
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          float rmT = smoothstep(uSweep - 30.0, uSweep, vRmW.x);
          float rmCourse = floor(vRmW.y / 9.0);
          float rmJy = smoothstep(0.43, 0.5, abs(fract(vRmW.y / 9.0) - 0.5));
          float rmJx = smoothstep(0.465, 0.5, abs(fract((vRmW.x + mod(rmCourse, 2.0) * 9.0) / 18.0) - 0.5));
          vec3 rmRaw = uRaw * (1.0 - 0.34 * max(rmJy, rmJx));
          diffuseColor.rgb = mix(uFin, rmRaw, rmT);
          float rmEdge = exp(-pow((vRmW.x - uSweep + 8.0) / 10.0, 2.0)) * step(-390.0, uSweep);
          diffuseColor.rgb += vec3(1.0, 0.84, 0.62) * rmEdge * 0.6;`
        );
    };
    materials.push(m);
    return m;
  };
  const mat = {
    steps: stone(),
    columns: stone({ fin: 0xefe9dd }),
    top: stone(),
    emblem: stone({ fin: 0xffffff, roughness: 0.5 }),
  };

  // ---- Geometry helpers --------------------------------------------------------------
  const svgText = await (await fetch('/brand/logo-full-white.svg')).text();
  await pause();
  const paths = new SVGLoader().parse(svgText).paths; // in document order, matching the part map
  await pause();
  const geos = [];
  const track = (g) => { geos.push(g); return g; };

  // A logo path, extruded and moved into world space. Rotating half a turn about X flips the
  // drawing's y-down axis without mirroring it, so face winding (and lighting) stay correct.
  const extrude = (i, depth, zCentre = 0, curveSegments = 6) => {
    const g = new THREE.ExtrudeGeometry(SVGLoader.createShapes(paths[i]), { depth, bevelEnabled: false, curveSegments });
    g.rotateX(Math.PI);
    g.translate(-CX, GROUND, zCentre + depth / 2);
    return track(g);
  };
  const box = (sx0, sx1, sy0, sy1, depth, zCentre = 0) => {
    const g = new THREE.BoxGeometry(sx1 - sx0, sy1 - sy0, depth);
    g.translate(X((sx0 + sx1) / 2), Y((sy0 + sy1) / 2), zCentre);
    return track(g);
  };
  const disc = (sxc, r, sy0, sy1, z) => {
    const g = new THREE.CylinderGeometry(r, r, sy1 - sy0, 48);
    g.translate(X(sxc), Y((sy0 + sy1) / 2), z);
    return track(g);
  };
  // One drum of a fluted, gently tapering column shaft.
  const drum = (sxc, z, yBot, yTop, rBot, rTop) => {
    const flutes = 16, per = 8;
    const g = new THREE.CylinderGeometry(rTop, rBot, yTop - yBot, flutes * per, 1, false);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), zz = p.getZ(i);
      const r = Math.hypot(x, zz);
      if (r < 0.01) continue;
      const t = (((Math.atan2(zz, x) / (Math.PI * 2)) * flutes) % 1 + 1) % 1;
      const k = 1 - 0.085 * Math.pow(Math.sin(t * Math.PI), 0.75);
      p.setX(i, x * k); p.setZ(i, zz * k);
    }
    g.computeVertexNormals();
    g.translate(X(sxc), (yBot + yTop) / 2, z);
    return track(g);
  };

  const temple = new THREE.Group();
  scene.add(temple);
  const parts = { steps: [], bases: [], drums: [], caps: [], ent: [], dentils: [], ped: [], digits: [], emblem: null };
  const mesh = (g, m, list) => {
    const o = new THREE.Mesh(g, m);
    o.castShadow = true; o.receiveShadow = true;
    temple.add(o);
    list?.push(o);
    return o;
  };

  // Steps: the logo's three bars as slabs, with recessed risers so the gaps between them read as shadow.
  [[1.0, 287.318, 224.695, 229.748, 178], [3.807, 284.511, 213.467, 218.52, 166], [6.614, 281.704, 202.239, 207.292, 154]].forEach(([x0, x1, y0, y1, d]) => mesh(box(x0, x1, y0, y1, d), mat.steps, parts.steps));
  mesh(box(6, 282.3, 218.52, 224.695, 168), mat.steps, parts.steps);
  mesh(box(9, 279.3, 207.292, 213.467, 156), mat.steps, parts.steps);

  const colX = [40.3, 248.05];
  const colZ = [ZC, -ZC];
  // The two capital outlines are extruded once each and copied to the four columns.
  const capCache = {};
  const capGeo = (i, z) => { capCache[i] ||= extrude(i, 46, 0, 8); const g = capCache[i].clone(); g.translate(0, 0, z); return track(g); };
  for (const [ci, cx] of colX.entries()) {
    for (const z of colZ) {
      // plinth and the two base rings
      mesh(box(cx - 30.5, cx + 30.5, 194.9, 202.239, 61, z), mat.columns, parts.bases);
      mesh(disc(cx, 29.45, 192.1, 194.9, z), mat.columns, parts.bases);
      mesh(disc(cx, 23.85, 186.5, 189.3, z), mat.columns, parts.bases);
      mesh(disc(cx, 20.6, 189.3, 192.1, z), mat.columns, parts.bases);
      mesh(disc(cx, 19.6, 183.8, 186.5, z), mat.columns, parts.bases);
      // shaft: five drums from y 183.8 up to 82.7, tapering to 90%
      const y0 = Y(183.8), y1 = Y(82.7), n = 5, h = (y1 - y0) / n;
      const col = [];
      for (let i = 0; i < n; i++) {
        const rb = R * (1 - 0.1 * (i / n)), rt = R * (1 - 0.1 * ((i + 1) / n));
        col.push(mesh(drum(cx, z, y0 + i * h + 0.35, y0 + (i + 1) * h - 0.35, rb, rt), mat.columns));
      }
      parts.drums.push(col);
      // neck ring, capital core, then the logo's own volute and echinus outlines in relief
      const cap = [];
      cap.push(mesh(disc(cx, 17.4, 79.8, 82.7, z), mat.columns));
      cap.push(mesh(disc(cx, 23.85, 77.0, 79.8, z), mat.columns));
      cap.push(mesh(box(cx - 22, cx + 22, 60.2, 77.0, 38, z), mat.columns));
      await pause();
      cap.push(mesh(capGeo(ci === 0 ? 19 : 31, z), mat.columns));
      cap.push(mesh(capGeo(ci === 0 ? 18 : 30, z), mat.columns));
      parts.caps.push(cap);
      await pause();
    }
  }

  // Entablature: a recessed core, the architrave band, and the 34 dentils exactly where the logo has them.
  mesh(box(8, 280.3, 37.75, 58.8, ENT_D - 10), mat.top, parts.ent);
  mesh(box(6.614, 281.704, 48.975, 54.028, ENT_D), mat.top, parts.ent);
  const dentilX = [[3.807, 6.614]];
  for (let k = 31; k >= 0; k--) dentilX.push([273.196 - k * 8.508, 278.868 - k * 8.508]);
  dentilX.push([281.704, 284.511]);
  dentilX.forEach(([x0, x1]) => mesh(box(x0, x1, 41.115, 46.168, ENT_D + 6), mat.top, parts.dentils));

  // Pediment: the logo's outer and inner triangles as a frame, with a recessed tympanum front and back.
  const tri = (pts) => { const s = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y))); s.closePath(); return s; };
  const outer = [[287.319, 37.746], [1, 37.746], [0.436, 32.757], [143.596, 0], [144.723, 0], [287.882, 32.757]];
  const inner = [[23.367, 32.694], [264.951, 32.694], [144.159, 5.054]];
  const pedFrame = tri(outer);
  pedFrame.holes.push(new THREE.Path(inner.map(([x, y]) => new THREE.Vector2(x, y))));
  const pedG = (shape, depth) => { const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false }); g.rotateX(Math.PI); g.translate(-CX, GROUND, depth / 2); return track(g); };
  mesh(pedG(pedFrame, ENT_D + 6), mat.top, parts.ped);
  mesh(pedG(tri(inner), ENT_D - 14), mat.top, parts.ped);
  // "2021", proud of the tympanum
  [89, 90, 91, 92].forEach((i) => mesh(extrude(i, 3.2, (ENT_D - 14) / 2 + 1.6, 6), mat.emblem, parts.digits));

  // Square and compasses with "RM": every stroke of the mark, in the doorway.
  const emblem = new THREE.Group();
  for (let i = 62; i <= 88; i++) {
    const o = new THREE.Mesh(extrude(i, 5, 0, 8), mat.emblem);
    o.castShadow = true; o.receiveShadow = true;
    emblem.add(o);
    if (i % 6 === 0) await pause();
  }
  const eb = new THREE.Box3().setFromObject(emblem).getCenter(new THREE.Vector3());
  emblem.children.forEach((o) => o.geometry.translate(-eb.x, -eb.y, -eb.z));
  emblem.position.copy(eb);
  temple.add(emblem);
  parts.emblem = emblem;

  // Ground: catches the shadow, plus a soft pool of light so the temple sits on something.
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), new THREE.ShadowMaterial({ opacity: 0.55 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.renderOrder = 2;
  scene.add(ground);
  const gc = document.createElement('canvas');
  gc.width = gc.height = 256;
  const g2 = gc.getContext('2d');
  const grad = g2.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,240,220,0.16)');
  grad.addColorStop(0.5, 'rgba(255,240,220,0.05)');
  grad.addColorStop(1, 'rgba(255,240,220,0)');
  g2.fillStyle = grad; g2.fillRect(0, 0, 256, 256);
  const poolTex = new THREE.CanvasTexture(gc);
  poolTex.colorSpace = THREE.SRGBColorSpace;
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(430, 300), new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false }));
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = -0.3;
  pool.renderOrder = 1;
  scene.add(pool);

  // ---- Camera -----------------------------------------------------------------------
  const view = { az: -31, el: 11, dist: 760, px: 0, py: 0, tx: 0, ty: 0 };
  const placeCamera = () => {
    const az = THREE.MathUtils.degToRad(view.az + view.px * 5);
    const el = THREE.MathUtils.degToRad(view.el - view.py * 2.2);
    camera.position.set(target.x + view.dist * Math.sin(az) * Math.cos(el), target.y + view.dist * Math.sin(el), target.z + view.dist * Math.cos(az) * Math.cos(el));
    camera.lookAt(target);
  };
  const fit = () => {
    const w = root.clientWidth, h = root.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    view.dist = Math.max((282 / 2) / t, ((mobile ? 332 : 366) / 2) / (t * camera.aspect));
    camera.updateProjectionMatrix();
    invalidate();
  };

  // ---- Render on demand -----------------------------------------------------------
  let dirty = true, raf = 0, onScreen = false, disposed = false;
  function invalidate() { dirty = true; }
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dx = view.tx - view.px, dy = view.ty - view.py;
    if (Math.abs(dx) > 0.0008 || Math.abs(dy) > 0.0008) { view.px += dx * 0.07; view.py += dy * 0.07; dirty = true; }
    if (!dirty) return;
    dirty = false;
    placeCamera();
    renderer.render(scene, camera);
  };
  const start = () => { if (!raf && !disposed) { dirty = true; raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  // ---- The assembly: one timeline, everything on a short stagger -----------------------
  const DROP = 330; // pieces come down from above the frame
  const all = [...parts.bases, ...parts.drums.flat(), ...parts.caps.flat(), ...parts.ent, ...parts.dentils, ...parts.ped, ...parts.digits];
  const tl = gsap.timeline({ paused: true, onUpdate: invalidate, onComplete: () => { built = true; root.classList.add('is-built'); onDone?.(); } });
  let built = false;
  const reset = () => {
    sweep.value = -400;
    warm.intensity = 0;
    parts.steps.forEach((o) => o.scale.set(1, 0.0001, 1));
    all.forEach((o) => { o.position.y = DROP; o.visible = false; });
    parts.dentils.forEach((o) => { o.position.y = 0; o.scale.set(1, 1, 0.0001); });
    parts.digits.forEach((o) => { o.position.set(0, 0, -5); });
    emblem.scale.setScalar(0.0001);
    emblem.rotation.y = -Math.PI * 1.25;
    Object.assign(view, { az: -31, el: 11 });
  };
  const show = (o, at) => tl.add(() => { o.visible = true; }, at);
  const drop = (o, at, dur = 0.66) => { show(o, at); tl.to(o.position, { y: 0, duration: dur, ease: 'expo.out' }, at); };

  tl.to(parts.steps.map((o) => o.scale), { y: 1, duration: 0.6, ease: 'expo.out', stagger: 0.05 }, 0);
  parts.bases.forEach((o) => drop(o, 0.2, 0.6));
  parts.drums.forEach((col) => col.forEach((o, i) => drop(o, 0.36 + i * 0.075, 0.62)));
  parts.caps.forEach((cap) => cap.forEach((o) => drop(o, 1.08, 0.62)));
  parts.ent.forEach((o, i) => drop(o, 1.46 + i * 0.05, 0.64));
  const mid = (parts.dentils.length - 1) / 2;
  parts.dentils.forEach((o, i) => { show(o, 1.8); tl.to(o.scale, { z: 1, duration: 0.36, ease: 'expo.out' }, 1.8 + Math.abs(i - mid) * 0.016); });
  parts.ped.forEach((o, i) => drop(o, 1.98 + i * 0.04, 0.72));
  parts.digits.forEach((o, i) => { show(o, 2.5); tl.to(o.position, { z: 0, duration: 0.4, ease: 'back.out(2)' }, 2.5 + i * 0.04); });
  tl.to(emblem.scale, { x: 1, y: 1, z: 1, duration: 0.85, ease: 'expo.out' }, 2.3)
    .to(emblem.rotation, { y: 0, duration: 1.05, ease: 'expo.out' }, 2.3)
    .to(sweep, { value: 240, duration: 1.05, ease: 'power2.inOut' }, 2.85)
    .to(warm, { intensity: 3600, duration: 1.1, ease: 'power2.out' }, 2.9)
    .to(view, { az: -15, el: 6.5, duration: 3.9, ease: 'power2.inOut' }, 0);

  reset();
  fit();
  placeCamera();
  // Compile shaders and upload geometry before the section arrives, with everything visible once.
  all.forEach((o) => { o.visible = true; });
  await pause();
  if (renderer.compileAsync) await renderer.compileAsync(scene, camera); else renderer.compile(scene, camera);
  await pause();
  renderer.render(scene, camera);
  renderer.clear();
  reset();
  invalidate();

  // ---- Lifecycle --------------------------------------------------------------------
  const ro = new ResizeObserver(fit);
  ro.observe(root);
  let played = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      onScreen = e.isIntersecting;
      if (onScreen) { start(); if (played && !built) tl.play(); }
      else { stop(); if (!built) tl.pause(); }
      if (e.intersectionRatio >= 0.5 && !played) { played = true; tl.play(0); }
    });
  }, { threshold: [0, 0.5] });
  io.observe(root);

  const stageEl = root.closest('section') || root;
  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const r = root.getBoundingClientRect();
    view.tx = THREE.MathUtils.clamp((e.clientX - (r.left + r.width / 2)) / r.width, -1, 1);
    view.ty = THREE.MathUtils.clamp((e.clientY - (r.top + r.height / 2)) / r.height, -1, 1);
  };
  const onLeave = () => { view.tx = 0; view.ty = 0; };
  stageEl.addEventListener('pointermove', onMove, { passive: true });
  stageEl.addEventListener('pointerleave', onLeave);

  const replay = () => { built = false; root.classList.remove('is-built'); tl.pause(0); reset(); invalidate(); tl.play(0); };

  // Hovering a service lights its part in brick. "finish" replays the rendering pass.
  let lit = null;
  const highlight = (part) => {
    if (!built) return;
    if (part === lit) return;
    lit = part;
    Object.entries(mat).forEach(([k, m]) => gsap.to(m, { emissiveIntensity: k === part ? 0.42 : 0, duration: 0.45, ease: 'power2.out', onUpdate: invalidate, overwrite: true }));
    if (part === 'finish') gsap.fromTo(sweep, { value: -240 }, { value: 240, duration: 1.1, ease: 'power2.inOut', onUpdate: invalidate, overwrite: true });
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    stop(); tl.kill(); ro.disconnect(); io.disconnect();
    stageEl.removeEventListener('pointermove', onMove);
    stageEl.removeEventListener('pointerleave', onLeave);
    geos.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    ground.geometry.dispose(); ground.material.dispose(); pool.geometry.dispose(); pool.material.dispose(); poolTex.dispose();
    renderer.dispose();
  };
  addEventListener('pagehide', dispose, { once: true });

  const api = { replay, highlight, dispose, finishNow: () => { played = true; tl.progress(1); placeCamera(); renderer.render(scene, camera); }, canvas };
  if (import.meta.env.DEV) window.__temple = api;
  return api;
}
