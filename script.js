/* Släktgolfen 2026 — The Lind Invitational */

// ===== Nedräkning =====
// Första start: söndag 5 juli 2026 kl 10:40
const TEE_OFF = new Date(2026, 6, 5, 10, 40, 0);
const DAY_END = new Date(2026, 6, 5, 23, 59, 59);

const countdownEl = document.getElementById('countdown');
const liveEl = document.getElementById('countdown-live');
const els = {
  days: document.getElementById('cd-days'),
  hours: document.getElementById('cd-hours'),
  mins: document.getElementById('cd-mins'),
  secs: document.getElementById('cd-secs'),
};

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const now = new Date();
  const diff = TEE_OFF - now;

  if (diff <= 0) {
    countdownEl.hidden = true;
    liveEl.hidden = false;
    liveEl.textContent = now <= DAY_END
      ? 'Tävlingen pågår — idag avgörs Släktgolfen'
      : 'Tack för i år — vi ses 2027';
    return;
  }

  els.days.textContent = Math.floor(diff / 86400000);
  els.hours.textContent = pad(Math.floor(diff / 3600000) % 24);
  els.mins.textContent = pad(Math.floor(diff / 60000) % 60);
  els.secs.textContent = pad(Math.floor(diff / 1000) % 60);
}

tick();
setInterval(tick, 1000);

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
