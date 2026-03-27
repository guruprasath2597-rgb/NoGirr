/* =============================================
   NoGirr — Core App JS
   Shared utilities across all pages
   ============================================= */

// ---- GLOBAL STATE ----
const NoGirr = {
  user: JSON.parse(localStorage.getItem('nogirr_user') || 'null'),
  lang: localStorage.getItem('nogirr_lang') || 'EN',
  i18n: {
    EN: { greeting: 'Good', dashboard: 'Dashboard', donate: 'Donate', find: 'Find Food' },
    HI: { greeting: 'नमस्ते', dashboard: 'डैशबोर्ड', donate: 'दान करें', find: 'भोजन खोजें' },
    TA: { greeting: 'வணக்கம்', dashboard: 'டாஷ்போர்டு', donate: 'தானம்', find: 'உணவு கண்டறி' },
    TE: { greeting: 'నమస్కారం', dashboard: 'డాష్‌బోర్డ్', donate: 'విరాళం', find: 'ఆహారం కనుగొను' },
    FR: { greeting: 'Bonjour', dashboard: 'Tableau', donate: 'Donner', find: 'Trouver' },
  },
  save() { localStorage.setItem('nogirr_user', JSON.stringify(this.user)); },
  logout() { localStorage.removeItem('nogirr_user'); window.location.href = '/index.html'; },
};

// ---- TOAST NOTIFICATIONS ----
function showToast(msg, type = 'info', duration = 4000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
  const colors = { success: 'var(--emerald)', error: 'var(--rose)', info: 'var(--purple-light)', warning: 'var(--amber)' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<i class="fa-solid ${icons[type]||icons.info}" style="color:${colors[type]||colors.info}"></i><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(40px)'; setTimeout(()=>t.remove(),300); }, duration);
}

// ---- MODAL HELPERS ----
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});

// ---- NAVBAR BUILDER ----
function buildNavbar(activePage) {
  const pages = [
    { href: '/pages/dashboard.html', icon: 'fa-grid-2', label: 'Dashboard' },
    { href: '/pages/find-food.html', icon: 'fa-map-location-dot', label: 'Find Food' },
    { href: '/pages/donate.html', icon: 'fa-hand-holding-heart', label: 'Donate' },
    { href: '/pages/calorie-tracker.html', icon: 'fa-fire-flame-curved', label: 'Health' },
    { href: '/pages/community.html', icon: 'fa-people-group', label: 'Community' },
  ];
  const nav = document.getElementById('appNavbar');
  if (!nav) return;
  const user = NoGirr.user || { name: 'Guest', role: 'recipient', avatar: 'G' };
  nav.innerHTML = `
    <div class="container navbar-inner">
      <a href="/index.html" class="navbar-logo">No<span style="color:var(--rose-light)">Girr</span></a>
      <ul class="navbar-nav">
        ${pages.map(p => `<li><a href="${p.href}" class="nav-link ${activePage===p.label?'active':''}"><i class="fa-solid ${p.icon}"></i> ${p.label}</a></li>`).join('')}
      </ul>
      <div class="navbar-actions">
        <div class="lang-switcher" onclick="cycleLangApp()" title="Language"><i class="fa-solid fa-globe"></i> <span id="langLabelApp">${NoGirr.lang}</span></div>
        <div class="notif-btn" onclick="showToast('No new notifications','info')"><i class="fa-solid fa-bell"></i><div class="notif-dot"></div></div>
        <div class="avatar avatar-sm" style="background:var(--gradient-purple);cursor:pointer" onclick="window.location='/pages/profile.html'">${(user.name||'G')[0].toUpperCase()}</div>
      </div>
    </div>`;
}

// ---- SIDEBAR BUILDER ----
function buildSidebar(activeLink) {
  const links = [
    { href: '/pages/dashboard.html', icon: 'fa-grid-2', label: 'Dashboard' },
    { href: '/pages/find-food.html', icon: 'fa-map-location-dot', label: 'Find Food' },
    { href: '/pages/donate.html', icon: 'fa-hand-holding-heart', label: 'Donate Food' },
    { href: '/pages/calorie-tracker.html', icon: 'fa-fire-flame-curved', label: 'Calorie Tracker' },
    { href: '/pages/community.html', icon: 'fa-people-group', label: 'Community' },
    { href: '/pages/profile.html', icon: 'fa-user', label: 'My Profile', section: 'Account' },
    { href: '/pages/admin.html', icon: 'fa-shield-halved', label: 'Admin', section: '' },
  ];
  const sb = document.getElementById('appSidebar');
  if (!sb) return;
  let lastSection = '';
  sb.innerHTML = links.map(l => {
    let html = '';
    if (l.section && l.section !== lastSection) {
      lastSection = l.section;
      html += `<div class="sidebar-section-label">${l.section}</div>`;
    }
    return html + `<a href="${l.href}" class="sidebar-link ${activeLink===l.label?'active':''}"><i class="fa-solid ${l.icon}"></i>${l.label}</a>`;
  }).join('');
  const user = NoGirr.user || {};
  const userBlock = document.getElementById('sidebarUser');
  if (userBlock) {
    userBlock.innerHTML = `
      <div class="flex" style="gap:10px;align-items:center;padding:16px;border-top:1px solid var(--glass-border);margin-top:12px">
        <div class="avatar avatar-sm" style="background:var(--gradient-purple)">${(user.name||'G')[0]}</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:0.85rem;font-family:var(--font-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${user.name||'Guest'}</div>
          <div style="font-size:0.7rem;color:var(--text-muted)">${user.role||'recipient'}</div>
        </div>
        <button onclick="NoGirr.logout()" title="Logout" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:0.9rem"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
      </div>`;
  }
}

// ---- LANGUAGE ----
const langs = ['EN','HI','TA','TE','FR'];
function cycleLangApp() {
  const idx = (langs.indexOf(NoGirr.lang) + 1) % langs.length;
  NoGirr.lang = langs[idx];
  localStorage.setItem('nogirr_lang', NoGirr.lang);
  const el = document.getElementById('langLabelApp');
  if (el) el.textContent = NoGirr.lang;
  showToast(`Language: ${NoGirr.lang}`, 'info');
}

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, duration = 1500) {
  let start = 0, step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

// ---- SCROLL ANIMATIONS ----
function initScrollAnim() {
  const els = document.querySelectorAll('.animate-on-scroll');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// ---- TIME GREETING ----
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// ---- FORMAT DATE ----
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ---- DISTANCE CALC ----
function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
}

// ---- GEOLOCATION ----
function getLocation(cb) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => cb(null, pos.coords), err => cb(err));
  } else cb(new Error('Geolocation not supported'));
}

// ---- MOCK FOOD DATA ----
const MOCK_DONATIONS = [
  { id:1, name:'Chicken Biryani', emoji:'🍱', donor:'Raj Kumar', avatar:'R', lat:13.0827, lng:80.2707, dist:0.8, free:true, qty:'10 servings', exp:'Today 6PM', phone:'+91 98765 43210', rating:4.8, live:true, type:'cooked', address:'Anna Nagar, Chennai' },
  { id:2, name:'Fresh Vegetables', emoji:'🥦', donor:'Priya Store', avatar:'P', lat:13.0900, lng:80.2800, dist:1.4, free:true, qty:'5 kg', exp:'Tomorrow', phone:'+91 87654 32109', rating:4.5, live:false, type:'raw', address:'T Nagar, Chennai' },
  { id:3, name:'Idli & Sambar', emoji:'🫓', donor:'Mahalakshmi', avatar:'M', lat:13.0750, lng:80.2600, dist:2.1, free:false, price:20, qty:'20 pieces', exp:'Today 2PM', phone:'+91 76543 21098', rating:4.9, live:true, type:'cooked', address:'Mylapore, Chennai' },
  { id:4, name:'Bread & Butter', emoji:'🍞', donor:'Suresh Bakery', avatar:'S', lat:13.0950, lng:80.2650, dist:2.8, free:true, qty:'3 loaves', exp:'Tomorrow', phone:'+91 65432 10987', rating:4.2, live:false, type:'packaged', address:'Egmore, Chennai' },
  { id:5, name:'Rice & Dal', emoji:'🍚', donor:'Ananya NGO', avatar:'A', lat:13.0700, lng:80.2750, dist:3.5, free:true, qty:'50 servings', exp:'Today 8PM', phone:'+91 54321 09876', rating:5.0, live:true, type:'cooked', address:'Adyar, Chennai' },
  { id:6, name:'Fruit Basket', emoji:'🍎', donor:'Green Fresh', avatar:'G', lat:13.0850, lng:80.2900, dist:4.2, free:false, price:50, qty:'2 kg', exp:'2 days', phone:'+91 43210 98765', rating:4.6, live:false, type:'raw', address:'Velachery, Chennai' },
];

// ---- FOOD DATABASE (subset) ----
const FOOD_DB = [
  { name:'Idli', cal:39, protein:2, carbs:8, fat:0.4, serving:'1 piece' },
  { name:'Dosa', cal:120, protein:3, carbs:20, fat:3, serving:'1 medium' },
  { name:'Sambar', cal:45, protein:2, carbs:7, fat:1, serving:'100ml' },
  { name:'Rice', cal:130, protein:2.7, carbs:28, fat:0.3, serving:'100g cooked' },
  { name:'Dal', cal:116, protein:9, carbs:20, fat:0.4, serving:'100g' },
  { name:'Chicken Curry', cal:180, protein:22, carbs:5, fat:8, serving:'100g' },
  { name:'Chapati', cal:95, protein:3, carbs:17, fat:2, serving:'1 piece' },
  { name:'Biryani', cal:290, protein:12, carbs:45, fat:8, serving:'200g' },
  { name:'Paneer', cal:265, protein:18, carbs:3, fat:20, serving:'100g' },
  { name:'Curd', cal:60, protein:3, carbs:4, fat:3, serving:'100g' },
  { name:'Egg', cal:78, protein:6, carbs:0.6, fat:5, serving:'1 whole' },
  { name:'Banana', cal:89, protein:1, carbs:23, fat:0.3, serving:'1 medium' },
  { name:'Apple', cal:52, protein:0.3, carbs:14, fat:0.2, serving:'1 medium' },
  { name:'Salad', cal:15, protein:1, carbs:3, fat:0, serving:'100g' },
  { name:'Oats', cal:150, protein:5, carbs:27, fat:3, serving:'40g dry' },
  { name:'Milk', cal:61, protein:3, carbs:5, fat:3, serving:'100ml' },
  { name:'Upma', cal:160, protein:4, carbs:27, fat:4, serving:'150g' },
  { name:'Poha', cal:180, protein:3, carbs:33, fat:4, serving:'150g' },
  { name:'Bread', cal:79, protein:3, carbs:15, fat:1, serving:'1 slice' },
  { name:'Orange', cal:47, protein:0.9, carbs:12, fat:0.1, serving:'1 medium' },
];

// ---- DIET PLANS ----
const DIET_PLANS = {
  weightLoss: {
    name: 'Weight Loss Plan', color: 'var(--rose)',
    calories: 1500, protein: 120, carbs: 150, fat: 50,
    meals: [
      { time:'7:00 AM', items: ['Oats 40g', 'Banana', 'Milk 200ml'], cal: 350 },
      { time:'10:00 AM', items: ['Apple', 'Curd 100g'], cal: 110 },
      { time:'1:00 PM', items: ['2 Chapati', 'Dal 100g', 'Salad'], cal: 380 },
      { time:'4:00 PM', items: ['Green tea', 'Handful almonds'], cal: 90 },
      { time:'7:30 PM', items: ['Rice 150g', 'Chicken curry 100g', 'Sambar'], cal: 480 },
    ]
  },
  muscleGain: {
    name: 'Muscle Gain Plan', color: 'var(--purple)',
    calories: 2800, protein: 180, carbs: 350, fat: 80,
    meals: [
      { time:'7:00 AM', items: ['Eggs 3', 'Bread 4 slices', 'Milk 300ml'], cal: 620 },
      { time:'10:00 AM', items: ['Banana 2', 'Peanut butter'], cal: 280 },
      { time:'1:00 PM', items: ['Rice 200g', 'Chicken 150g', 'Dal'], cal: 750 },
      { time:'4:00 PM', items: ['Paneer 100g', 'Chapati 2'], cal: 450 },
      { time:'7:30 PM', items: ['Biryani 250g', 'Curd 150g'], cal: 620 },
    ]
  },
  diabetic: {
    name: 'Diabetic-Friendly', color: 'var(--emerald)',
    calories: 1800, protein: 100, carbs: 200, fat: 60,
    meals: [
      { time:'7:00 AM', items: ['Oats 40g', 'Egg 2', 'Milk 200ml (low fat)'], cal: 380 },
      { time:'10:00 AM', items: ['Cucumber', 'Curd 100g'], cal: 75 },
      { time:'1:00 PM', items: ['2 Chapati', 'Dal', '2 sabzis', 'Salad'], cal: 480 },
      { time:'4:00 PM', items: ['Handful nuts', 'Green tea'], cal: 100 },
      { time:'7:30 PM', items: ['Upma 150g', 'Sambar', 'Salad'], cal: 320 },
    ]
  },
  balanced: {
    name: 'Balanced Nutrition', color: 'var(--amber)',
    calories: 2000, protein: 120, carbs: 250, fat: 65,
    meals: [
      { time:'7:00 AM', items: ['Idli 4', 'Sambar', 'Chutney'], cal: 320 },
      { time:'10:00 AM', items: ['Fruit salad', 'Curd'], cal: 140 },
      { time:'1:00 PM', items: ['Rice 150g', 'Dal', 'Sabzi', 'Salad'], cal: 520 },
      { time:'4:00 PM', items: ['Poha 150g', 'Tea'], cal: 200 },
      { time:'7:30 PM', items: ['2 Chapati', 'Paneer curry', 'Dal'], cal: 560 },
    ]
  }
};

// ---- AUTH GUARD ----
function requireAuth(role) {
  if (!NoGirr.user) { window.location.href = '/pages/auth.html'; return false; }
  if (role && NoGirr.user.role !== role && NoGirr.user.role !== 'admin') {
    showToast('Access restricted', 'error'); return false;
  }
  return true;
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnim();
  buildNavbar();
  buildSidebar();
});

window.NoGirr = NoGirr;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.animateCounter = animateCounter;
window.getGreeting = getGreeting;
window.formatDate = formatDate;
window.calcDistance = calcDistance;
window.getLocation = getLocation;
window.MOCK_DONATIONS = MOCK_DONATIONS;
window.FOOD_DB = FOOD_DB;
window.DIET_PLANS = DIET_PLANS;
window.buildNavbar = buildNavbar;
window.buildSidebar = buildSidebar;
window.cycleLangApp = cycleLangApp;
