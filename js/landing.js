/* =============================================
   NoGirr — Landing Page JS
   Splash Animation + Particles + Scroll FX
   ============================================= */

// ---- SPLASH SCREEN ----
(function () {
  const splash = document.getElementById('splash');
  const letters = document.querySelectorAll('.logo-letter');
  const tagline = document.getElementById('splash-tagline');
  const bar = document.getElementById('splash-bar');
  const barFill = document.getElementById('splash-bar-fill');
  const pct = document.getElementById('splash-percent');
  const canvas = document.getElementById('splash-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  if (!splash) return;

  // Resize canvas
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Floating food particles on splash
  const foodEmojis = ['🍎', '🍕', '🥗', '🍱', '🫐', '🥑', '🍇', '🌮', '🥕', '🍊', '🥦', '🍓'];
  const particles = [];
  function createSplashParticle() {
    if (!canvas) return;
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 60,
      emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
      size: Math.random() * 24 + 16,
      speed: Math.random() * 1.5 + 0.5,
      drift: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.4 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
    };
  }
  for (let i = 0; i < 18; i++) {
    const p = createSplashParticle();
    if (p) { p.y = Math.random() * (canvas ? canvas.height : 600); particles.push(p); }
  }

  let animFrame;
  function drawSplashParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
      p.y -= p.speed;
      p.x += p.drift;
      p.rotation += p.rotSpeed;
      if (p.y < -60) particles[i] = createSplashParticle();
    });
    animFrame = requestAnimationFrame(drawSplashParticles);
  }
  drawSplashParticles();

  // Animate letters in
  let progress = 0;
  const letterDelay = [0, 100, 220, 340, 460, 580];
  letters.forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
    }, 400 + letterDelay[i]);
  });

  // Show tagline
  setTimeout(() => {
    tagline.style.transition = 'all 0.7s ease';
    tagline.style.opacity = '1';
    tagline.style.transform = 'translateY(0)';
    bar.style.transition = 'opacity 0.5s ease';
    bar.style.opacity = '1';
    pct.style.transition = 'opacity 0.5s ease';
    pct.style.opacity = '1';
  }, 1200);

  // Progress bar animation
  setTimeout(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 4 + 1;
      if (p >= 100) { p = 100; clearInterval(interval); }
      barFill.style.width = p + '%';
      pct.textContent = Math.floor(p) + '%';
    }, 40);
  }, 1300);

  // Exit splash - call the global skipSplash after animation completes
  setTimeout(() => {
    if (typeof skipSplash === 'function') skipSplash();
  }, 2000);

  document.body.style.overflow = 'hidden';
})();

// ---- HERO PARTICLES ----
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const foodEmojis = ['🍎', '🍕', '🥗', '🍱', '🫐', '🥑', '🍇', '🌮', '🥕', '🍊'];
  const pts = [];
  for (let i = 0; i < 25; i++) {
    pts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
      size: Math.random() * 18 + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.15 + 0.05,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.restore();
      p.x += p.vx; p.y += p.vy;
      if (p.x < -30) p.x = canvas.width + 30;
      if (p.x > canvas.width + 30) p.x = -30;
      if (p.y < -30) p.y = canvas.height + 30;
      if (p.y > canvas.height + 30) p.y = -30;
    });
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  });
}

// ---- SCROLL ANIMATIONS ----
function initScrollAnimations() {
  const els = document.querySelectorAll('.animate-on-scroll');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.style.animationDelay || '0s';
        setTimeout(() => e.target.classList.add('in-view'), parseFloat(delay) * 1000);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ---- COUNTERS ----
function initCounters() {
  const counters = document.querySelectorAll('.counter, .hero-stat-num');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true';
        const target = parseInt(e.target.dataset.target || e.target.textContent);
        if (!target) return;
        let cur = 0;
        const step = target / 80;
        const timer = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(timer); }
          e.target.textContent = Math.floor(cur).toLocaleString();
        }, 20);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

// ---- NAVBAR SCROLL ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(8,8,16,0.95)';
    nav.style.borderBottomColor = 'rgba(124,58,237,0.2)';
  } else {
    nav.style.background = 'rgba(8,8,16,0.7)';
    nav.style.borderBottomColor = 'rgba(255,255,255,0.1)';
  }
});

// ---- MOBILE MENU ----
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const ham = document.getElementById('hamburger');
  if (!menu) return;
  menu.classList.toggle('open');
  if (ham) ham.classList.toggle('active');
}

// ---- LANGUAGE CYCLE ----
const langs = [
  { code: 'EN', label: 'EN' },
  { code: 'HI', label: 'हि' },
  { code: 'TA', label: 'த' },
  { code: 'TE', label: 'తె' },
  { code: 'FR', label: 'FR' },
];
let langIdx = 0;
function cycleLang() {
  langIdx = (langIdx + 1) % langs.length;
  const el = document.getElementById('langLabel');
  if (el) el.textContent = langs[langIdx].label;
  showToast(`Language: ${langs[langIdx].code}`, 'info');
}

// ---- SMOOTH SCROLL FOR NAV LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.remove('open');
    }
  });
});

// ---- TOAST ----
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  const colors = { success: 'var(--emerald)', error: 'var(--rose)', info: 'var(--purple-light)' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${icons[type]}" style="color:${colors[type]}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4200);
}

// Init if splash already gone (e.g. page refresh fast)
if (document.readyState === 'complete') {
  const splash = document.getElementById('splash');
  if (!splash || splash.style.display === 'none') {
    initHeroParticles(); initScrollAnimations(); initCounters();
  }
}
