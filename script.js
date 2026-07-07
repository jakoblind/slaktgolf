/* Släktgolfen — The Lind Invitational
   Historik och nästa upplaga hämtas från data.js */

// ===== Mästartabellen =====
const tbody = document.getElementById('champions-body');
if (tbody) {
  const rows = withOrdinals().slice().reverse();
  tbody.innerHTML = rows.map((e, i) => {
    const reigning = i === 0;
    const badge = reigning ? ' <span class="champ-badge">Regerande</span>' : '';
    return `<tr${reigning ? ' class="champ-reigning"' : ''}>
      <td>${e.year}</td>
      <td><span class="champ-name">${e.winner}</span>${badge}</td>
      <td>${e.venue || '—'}</td>
      <td class="td-right">${ordinalSv(e.titleNum)}</td>
    </tr>`;
  }).join('');

  const counts = titleCounts();
  const max = Math.max(...Object.values(counts));
  const leaders = Object.keys(counts).filter((n) => counts[n] === max);
  document.getElementById('champions-note').textContent =
    `Flest titlar: ${leaders.join(' och ')}, ${max} vardera. ` +
    'De årtal och banor som saknas är — likt mycket annat i släkten — föremål för diskussion.';
}

// ===== Rotationen =====
const rotationEl = document.getElementById('rotation-grid');
if (rotationEl) {
  const played = EDITIONS.filter((e) => e.venue);
  const unknown = EDITIONS.filter((e) => !e.venue);
  const cards = [];

  if (unknown.length) {
    cards.push(`
      <article class="rotation-card rotation-card-mystery">
        <span class="rotation-year">${unknown[0].year}–${unknown[unknown.length - 1].year}</span>
        <span class="rotation-venue">Banor under utredning</span>
        <span class="rotation-winner">Historiska avdelningen arbetar</span>
      </article>`);
  }

  played.forEach((e) => {
    cards.push(`
      <article class="rotation-card">
        <span class="rotation-year">${e.year}</span>
        <span class="rotation-venue">${e.venue}</span>
        <span class="rotation-winner">Mästare: ${e.winner}</span>
      </article>`);
  });

  cards.push(`
    <article class="rotation-card rotation-card-next">
      <span class="rotation-year">${NEXT.year}</span>
      <span class="rotation-venue">${NEXT.venue}</span>
      <span class="rotation-winner">Nästa värd · 3–4 juli</span>
    </article>`);

  rotationEl.innerHTML = cards.join('');
}

// ===== Nedräkning till nästa golfdag =====
const countdownEl = document.getElementById('countdown');
const liveEl = document.getElementById('countdown-live');

if (countdownEl && NEXT.date) {
  const [y, m, d] = NEXT.date.split('-').map(Number);
  const TEE_OFF = new Date(y, m - 1, d, 0, 0, 0);
  const DAY_END = new Date(y, m - 1, d, 23, 59, 59);
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };
  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const now = new Date();
    const diff = TEE_OFF - now;
    if (diff <= 0) {
      countdownEl.hidden = true;
      liveEl.hidden = false;
      liveEl.textContent = now <= DAY_END
        ? 'Tävlingen pågår — idag avgörs Släktgolfen'
        : 'Tack för i år — vi ses nästa sommar';
      return;
    }
    els.days.textContent = Math.floor(diff / 86400000);
    els.hours.textContent = pad(Math.floor(diff / 3600000) % 24);
    els.mins.textContent = pad(Math.floor(diff / 60000) % 60);
    els.secs.textContent = pad(Math.floor(diff / 1000) % 60);
  }
  tick();
  setInterval(tick, 1000);
}

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const photos = Array.from(document.querySelectorAll('.gallery-item img, .winner-photo img, .trophy-figure img'));
  let current = 0;

  function openLightbox(i) {
    current = (i + photos.length) % photos.length;
    const img = photos[current];
    const fig = img.closest('figure');
    const cap = fig ? fig.querySelector('figcaption') : null;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = cap ? cap.textContent : (img.alt || '');
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  photos.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(i));
  });

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); openLightbox(current - 1); });
  document.getElementById('lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); openLightbox(current + 1); });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(current - 1);
    if (e.key === 'ArrowRight') openLightbox(current + 1);
  });
}

// ===== Scroll-reveal =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// ===== Toppbar: göm vid scroll ner, visa vid scroll upp =====
const topbar = document.getElementById('topbar');
let lastY = window.scrollY;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 140 && y > lastY) {
    topbar.classList.add('hidden');
  } else {
    topbar.classList.remove('hidden');
  }
  lastY = y;
}, { passive: true });

// ===== Mobilmeny =====
const toggle = document.getElementById('navtoggle');
const nav = document.getElementById('topnav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});
