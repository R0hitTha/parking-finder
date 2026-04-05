/**
 * ParkFinder — Global App Utilities
 * Dark mode, nav state, toasts, user session rendering.
 */

// ─── Dark Mode ───────────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('pf_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('pf_theme', next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  const sunIcon  = document.getElementById('icon-sun');
  const moonIcon = document.getElementById('icon-moon');
  if (sunIcon)  sunIcon.style.display  = theme === 'dark'  ? 'block' : 'none';
  if (moonIcon) moonIcon.style.display = theme === 'light' ? 'block' : 'none';
}

// ─── Navbar Auth State ────────────────────────────────────────────────────────
function renderNavAuth() {
  const user = getCurrentUser();
  const actionsEl = document.getElementById('nav-auth-actions');
  const avatarEl  = document.getElementById('nav-avatar-wrap');
  const dropEl    = document.getElementById('nav-dropdown');

  if (!actionsEl) return;

  if (user) {
    actionsEl.innerHTML = '';
    if (avatarEl) {
      avatarEl.style.display = 'flex';
      avatarEl.querySelector('.nav-avatar').textContent = user.avatar || user.name.charAt(0);
    }
    if (dropEl) {
      dropEl.innerHTML = `
        <div style="padding:10px 12px; border-bottom:1px solid var(--border);">
          <div style="font-weight:600;font-size:0.9rem">${user.name}</div>
          <div style="font-size:0.78rem;color:var(--text-2)">${user.email}</div>
        </div>
        ${user.role === 'admin' ? `<a href="admin.html">Admin Panel</a>` : ''}
        <a href="favourites.html">My Favourites</a>
        <hr>
        <a href="#" id="logout-btn">Log Out</a>
      `;
      document.getElementById('logout-btn')?.addEventListener('click', e => {
        e.preventDefault();
        logoutUser();
        showToast('Logged out successfully.', 'info');
        setTimeout(() => { window.location.href = 'login.html'; }, 1000);
      });
    }
  } else {
    actionsEl.innerHTML = `<a href="login.html" class="btn btn-primary btn-sm">Login</a>`;
    if (avatarEl) avatarEl.style.display = 'none';
  }
}

// ─── Nav Dropdown Toggle ─────────────────────────────────────────────────────
function initNavDropdown() {
  const avatarEl = document.querySelector('.nav-avatar');
  const dropEl   = document.getElementById('nav-dropdown');
  if (!avatarEl || !dropEl) return;
  avatarEl.addEventListener('click', e => {
    e.stopPropagation();
    dropEl.classList.toggle('show');
  });
  document.addEventListener('click', () => dropEl.classList.remove('show'));
}

// ─── Hamburger Mobile Nav ─────────────────────────────────────────────────────
function initHamburger() {
  const ham    = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!ham || !mobileNav) return;
  ham.addEventListener('click', () => {
    mobileNav.classList.toggle('show');
    const spans = ham.querySelectorAll('span');
    spans.forEach(s => s.style.opacity = mobileNav.classList.contains('show') ? '0.5' : '1');
  });
}

// ─── Toast Notifications ──────────────────────────────────────────────────────
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const iconSvg = {
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${iconSvg[type] || iconSvg.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── Active Nav Link ──────────────────────────────────────────────────────────
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === page || (page === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });
}

// ─── Modal Helpers ────────────────────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('show'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('show'); document.body.style.overflow = ''; }
}
function initModals() {
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modalClose));
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });
}

// ─── Render Parking Card ───────────────────────────────────────────────────────
function renderParkingCard(spot, userLat, userLng) {
  const avail = getAvailabilityStatus(spot);
  const dist  = (userLat && userLng) ? formatDistance(calculateDistance(userLat, userLng, spot.lat, spot.lng)) : null;
  const fav   = isFavorite(spot.id);
  const typeLabel = spot.type === 'covered' ? 'Covered' : 'Open Air';

  return `
    <div class="park-card card animate-in" data-id="${spot.id}">
      <div class="park-card-header">
        <span class="badge badge-${spot.type}">${typeLabel}</span>
        <button class="fav-btn ${fav ? 'active' : ''}" data-id="${spot.id}" title="Save favourite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${fav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <div class="park-card-body">
        <h3 class="park-name">${spot.name}</h3>
        <p class="park-addr text-muted text-sm">${spot.address}</p>
        <div class="park-meta">
          ${dist ? `<span class="meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.7;margin-right:3px;vertical-align:-1px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${dist}</span>` : ''}
          <span class="meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="color:#f59e0b;margin-right:3px;vertical-align:-1px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${spot.rating} <span class="text-muted">(${spot.reviewCount})</span></span>
        </div>
        <div class="park-avail">
          <div class="avail-header">
            <span class="badge badge-${avail.cls}">${avail.label}</span>
            <span class="avail-total text-muted text-sm">${spot.totalSlots} total</span>
          </div>
          <div class="avail-bar mt-1"><div class="avail-fill ${avail.cls}" style="width:${avail.pct}%"></div></div>
        </div>
        <div class="park-price">
          <span class="price-main">${formatPrice(spot.pricePerHour)}<span class="price-unit">/hr</span></span>
          <span class="price-day text-muted text-sm">${formatPrice(spot.pricePerDay)}/day</span>
        </div>
      </div>
      <div class="park-card-footer">
        <a href="https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}" target="_blank" class="btn btn-secondary btn-sm">
          Navigate
        </a>
        <a href="details.html?id=${spot.id}" class="btn btn-primary btn-sm">View Details &rarr;</a>
      </div>
    </div>
  `;
}

// ─── Favourite Button Delegation ──────────────────────────────────────────────
function initFavButtons(container) {
  container.addEventListener('click', e => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;
    if (!getCurrentUser()) {
      showToast('Please login to save favourites.', 'error');
      return;
    }
    const added = toggleFavorite(btn.dataset.id);
    const svg   = btn.querySelector('svg');
    if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');
    btn.classList.toggle('active', added);
    showToast(added ? 'Added to favourites.' : 'Removed from favourites.', added ? 'success' : 'info');
  });
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderNavAuth();
  initNavDropdown();
  initHamburger();
  setActiveNav();
  initModals();

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
});
