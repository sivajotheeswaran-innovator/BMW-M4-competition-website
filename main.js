const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = innerWidth < 768;
const stage = document.getElementById('stage');
const main = document.getElementById('chapters');
const rail = document.getElementById('rail');
const bar = document.querySelector('#mbar');
const vids = {};
const order = [];
gsap.registerPlugin(ScrollTrigger);

const lenis = reduce ? null : new Lenis({ lerp: 0.1 });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const goTo = id => lenis ? lenis.scrollTo('#' + id) : document.getElementById(id).scrollIntoView();

function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

CHAPTERS.forEach((c, i) => {
  const sec = el('section', 'chapter ' + c.type); sec.id = c.id;
  sec.style.height = c.length * 100 + 'vh';
  const copy = el('div', 'copy' + (c.first ? ' hero' : ''));
  if (c.eyebrow) copy.append(el('p', 'eyebrow', c.eyebrow));
  const h = el(c.first ? 'h1' : 'h2', null, c.title);
  copy.append(h, el('p', 'lede', c.text));
  if (c.callouts) copy.append(el('ul', 'callouts', c.callouts.map(t => `<li>${t}</li>`).join('')));
  if (c.stats) copy.append(el('div', 'stats', c.stats.map(s => `<div><b data-v="${s.v}" data-d="${s.d || 0}">0</b><span>${s.l}</span></div>`).join('')));
  if (c.type === 'colour') {
    const box = el('div', 'paint');
    const imgs = c.swatches.map((s, k) => { const im = el('img'); im.src = s.img; im.alt = s.name + ' M4'; if (!k) im.className = 'on'; box.append(im); return im; });
    const row = el('div', 'swatches');
    c.swatches.forEach((s, k) => {
      const b = el('button'); b.style.setProperty('--c', s.color); b.setAttribute('aria-label', s.name); b.title = s.name;
      b.onclick = () => { imgs.forEach((m, j) => m.classList.toggle('on', j === k)); row.querySelectorAll('button').forEach((x, j) => x.classList.toggle('sel', j === k)); };
      if (!k) b.className = 'sel'; row.append(b);
    });
    copy.append(row); sec.append(box);
  }
  if (c.links) copy.append(el('p', 'cta', c.links.map(l => `<a href="${l.href}">${l.label}</a>`).join('')),
    el('p', 'fine', 'Fan concept project. Not affiliated with, or endorsed by, BMW AG. BMW and M are trademarks of BMW AG.'));
  sec.append(copy); main.append(sec);

  if (c.type === 'video') {
    const v = el('video'); v.muted = true; v.playsInline = true; v.preload = i < 2 ? 'auto' : 'metadata';
    v.src = (mobile && c.clipMobile) || c.clip; if (c.poster) v.poster = c.poster;
    stage.append(v);
    vids[c.id] = { v, cur: 0, target: 0, on: false };
    order.push(c.id);
  }

  let rb;
  if (c.rail) { rb = el('button', null, c.rail); rb.onclick = () => goTo(c.id); rail.append(rb); }

  const stat = c.stats && [...copy.querySelectorAll('b')];
  ScrollTrigger.create({
    trigger: sec, start: 'top top', end: 'bottom bottom',
    onUpdate: s => {
      const p = s.progress;
      const o = c.first && p < .5 ? 1 : p < .1 ? p / .1 : p > .9 ? (1 - p) / .1 : 1;
      copy.style.opacity = o; copy.style.transform = `translateY(${(1 - o) * 24}px)`;
      if (vids[c.id]) vids[c.id].target = p;
    },
    onToggle: s => {
      const a = vids[c.id]; if (a) { a.on = s.isActive; a.v.classList.toggle('on', s.isActive); }
      if (!s.isActive) return;
      document.body.classList.toggle('has-rail', !!c.rail);
      [...rail.children].forEach(b => b.classList.toggle('now', b === rb));
      const idx = order.indexOf(c.id);
      const nxtId = order[idx + 1];
      if (typeof toBlob === 'function') {
        toBlob(c.id);
        if (nxtId) toBlob(nxtId);
      }
      const nxt = vids[nxtId]; if (nxt) nxt.v.preload = 'auto'; // warm up the next clip
      if (stat) stat.forEach(b => { const o = { n: 0 }, d = +b.dataset.d; gsap.to(o, { n: +b.dataset.v, duration: 1.4, ease: 'power2.out', onUpdate: () => b.textContent = o.n.toFixed(d) }); });
    }
  });
});

// Scrub videos: ease the playhead toward the scroll position.
gsap.ticker.add(() => {
  if (reduce) return;
  for (const id in vids) {
    const o = vids[id]; if (!o.on || !o.v.duration) continue;
    o.cur += (o.target - o.cur) * 0.14;
    const t = Math.min(o.cur * o.v.duration, o.v.duration - 0.05);
    if (Math.abs(o.v.currentTime - t) > 0.012) o.v.currentTime = t;
  }
});

// Page progress: the three-stripe bar.
ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => bar.style.setProperty('--p', s.progress) });

// Loader: wait for the first clip (or 8 s), then open.
const first = vids[order[0]].v, pct = document.getElementById('pct');
let done = false;
const open = () => { if (done) return; done = true; document.getElementById('loader').classList.add('done'); first.classList.add('on'); vids[order[0]].on = true; ScrollTrigger.refresh(); };
const tick = () => { const b = first.buffered; const r = first.duration && b.length ? b.end(b.length - 1) / first.duration : 0; pct.textContent = Math.round(Math.min(r, 1) * 100) + '%'; };
first.addEventListener('progress', tick); first.addEventListener('loadeddata', () => { tick(); setTimeout(open, 500); });
first.addEventListener('error', open); setTimeout(open, 8000);

// Fully download clips into memory as Blobs for instant, local-speed scrubbing
const blobbed = {};
async function toBlob(id) {
  const o = vids[id];
  if (!o || blobbed[id]) return;
  blobbed[id] = 'loading';
  try {
    const src = o.v.currentSrc || o.v.src;
    const r = await fetch(src);
    if (!r.ok) throw new Error('Fetch failed ' + r.status);
    const b = await r.blob();
    const blobUrl = URL.createObjectURL(b);
    const t = o.v.currentTime;
    o.v.src = blobUrl;
    o.v.currentTime = t;
    blobbed[id] = true;
  } catch (e) {
    blobbed[id] = false;
  }
}

// Sequentially cache clips in scroll order once the loader opens
setTimeout(async () => {
  for (const id of order) {
    if (!blobbed[id]) await toBlob(id);
  }
}, 1500);

