/**
 * ParkFinder — Admin Panel Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Guard: admin only
  const user = getCurrentUser();
  if (!user) { window.location.href = 'login.html'; return; }
  if (user.role !== 'admin') {
    showToast('Admin access required.', 'error');
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    return;
  }

  loadDashboard();
  loadSpots();
  loadUsers();
  loadLog();

  // Spots search filter
  document.getElementById('spots-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#spots-tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // Add Spot button
  document.getElementById('add-spot-btn')?.addEventListener('click', () => openSpotModal(null));

  // Spot form submit
  document.getElementById('spot-form')?.addEventListener('submit', e => {
    e.preventDefault();
    saveSpot();
  });
});

// ─── Panel Switch ───────────────────────────────────────────────────────────
function showPanel(name) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  document.getElementById('panel-' + name)?.classList.add('active');
  document.querySelectorAll('.sidebar-link').forEach(l => {
    if (l.getAttribute('onclick')?.includes("'" + name + "'")) l.classList.add('active');
  });
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
function loadDashboard() {
  const spots   = getAllSpots();
  const users   = getAllUsers();
  const reviews = JSON.parse(localStorage.getItem('pf_reviews') || '[]');
  const avail   = spots.filter(s => s.availableSlots > 0).length;
  const avgRat  = (spots.reduce((s, sp) => s + sp.rating, 0) / spots.length).toFixed(1);

  document.getElementById('dash-stats').innerHTML = `
    <div class="stat-card animate-in">
      <div class="stat-card-icon stat-icon-p">P</div>
      <div class="stat-card-label">Total Spots</div>
      <div class="stat-card-value c-accent">${spots.length}</div>
    </div>
    <div class="stat-card animate-in-2">
      <div class="stat-card-icon stat-icon-check">&#10003;</div>
      <div class="stat-card-label">Available Now</div>
      <div class="stat-card-value c-success">${avail}</div>
    </div>
    <div class="stat-card animate-in-3">
      <div class="stat-card-icon stat-icon-users">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div class="stat-card-label">Registered Users</div>
      <div class="stat-card-value c-purple">${users.length}</div>
    </div>
    <div class="stat-card animate-in-4">
      <div class="stat-card-icon stat-icon-review">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div class="stat-card-label">Total Reviews</div>
      <div class="stat-card-value c-warning">${reviews.length}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="color:#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </div>
      <div class="stat-card-label">Avg. Rating</div>
      <div class="stat-card-value c-accent">${avgRat}</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-icon stat-icon-rupee">&#8377;</div>
      <div class="stat-card-label">Avg Price/hr</div>
      <div class="stat-card-value c-success">&#8377;${Math.round(spots.reduce((s,sp)=>s+sp.pricePerHour,0)/spots.length)}</div>
    </div>
  `;

  const log = getLog().slice(0, 8);
  document.getElementById('dash-log').innerHTML = log.length === 0
    ? '<div class="log-item">No activity yet.</div>'
    : log.map(l => `
      <div class="log-item">
        <div class="log-dot"></div>
        <div>
          <div class="log-action">${l.action}</div>
          <div class="log-meta">By ${l.user} &middot; ${new Date(l.timestamp).toLocaleString()}</div>
        </div>
      </div>
    `).join('');
}

// ─── Spots Table ─────────────────────────────────────────────────────────────
function loadSpots() {
  const spots = getAllSpots();
  document.getElementById('spots-count').textContent = spots.length;
  document.getElementById('spots-tbody').innerHTML = spots.map(s => {
    const avail     = getAvailabilityStatus(s);
    const typeLabel = s.type === 'covered' ? 'Covered' : 'Open Air';
    return `
      <tr>
        <td><strong>${s.name}</strong><br/><span style="font-size:0.75rem;color:var(--text-2)">${s.address.substring(0,40)}&hellip;</span></td>
        <td><span class="badge badge-${s.type}">${typeLabel}</span></td>
        <td>&#8377;${s.pricePerHour}</td>
        <td>${s.totalSlots}</td>
        <td><span class="badge badge-${avail.cls}">${avail.label}</span></td>
        <td><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="color:#f59e0b;vertical-align:-1px;margin-right:2px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${s.rating}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-secondary btn-sm" onclick="openSpotModal('${s.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDelete('${s.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ─── Users Table ──────────────────────────────────────────────────────────────
function loadUsers() {
  const users = getAllUsers();
  document.getElementById('users-count').textContent = users.length;
  document.getElementById('users-tbody').innerHTML = users.map(u => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--accent-grad);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;color:#fff;flex-shrink:0">${u.avatar || u.name.charAt(0)}</div>
          <strong>${u.name}</strong>
        </div>
      </td>
      <td>${u.email}</td>
      <td><span class="role-badge role-${u.role}">${u.role === 'admin' ? 'Admin' : 'User'}</span></td>
      <td style="font-size:0.8rem;color:var(--text-2)">${new Date(u.createdAt).toLocaleDateString()}</td>
    </tr>
  `).join('');
}

// ─── Activity Log ──────────────────────────────────────────────────────────────
function loadLog() {
  const log = getLog();
  document.getElementById('full-log').innerHTML = log.length === 0
    ? '<div class="log-item">No activity recorded yet.</div>'
    : log.map(l => `
      <div class="log-item">
        <div class="log-dot"></div>
        <div>
          <div class="log-action">${l.action}</div>
          <div class="log-meta">By ${l.user} &middot; ${new Date(l.timestamp).toLocaleString()}</div>
        </div>
      </div>
    `).join('');
}

// ─── Add / Edit Spot Modal ─────────────────────────────────────────────────────
let editingSpotId = null;

function openSpotModal(spotId) {
  editingSpotId = spotId;
  const spot = spotId ? getSpotById(spotId) : null;
  document.getElementById('spot-modal-title').textContent = spot ? 'Edit Parking Spot' : 'Add Parking Spot';
  document.getElementById('sf-submit').textContent = spot ? 'Update Spot' : 'Add Spot';

  const fields = {
    'sf-name':      spot?.name || '',
    'sf-address':   spot?.address || '',
    'sf-lat':       spot?.lat || '',
    'sf-lng':       spot?.lng || '',
    'sf-price-hr':  spot?.pricePerHour || '',
    'sf-price-day': spot?.pricePerDay || '',
    'sf-total':     spot?.totalSlots || '',
    'sf-avail':     spot?.availableSlots || '',
    'sf-type':      spot?.type || 'covered',
    'sf-amenities': spot?.amenities?.join(', ') || '',
    'sf-open':      spot?.openTime || '00:00',
    'sf-close':     spot?.closeTime || '23:59',
    'sf-desc':      spot?.description || '',
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  openModal('spot-modal');
}

function saveSpot() {
  const get = id => document.getElementById(id)?.value?.trim();
  const name = get('sf-name');
  if (!name) { showToast('Spot name is required.', 'error'); return; }

  const data = {
    name,
    address:       get('sf-address'),
    lat:           parseFloat(get('sf-lat')),
    lng:           parseFloat(get('sf-lng')),
    pricePerHour:  parseInt(get('sf-price-hr')),
    pricePerDay:   parseInt(get('sf-price-day')),
    totalSlots:    parseInt(get('sf-total')),
    availableSlots: parseInt(get('sf-avail')),
    type:          get('sf-type'),
    amenities:     get('sf-amenities') ? get('sf-amenities').split(',').map(s => s.trim()) : [],
    openTime:      get('sf-open'),
    closeTime:     get('sf-close'),
    description:   get('sf-desc'),
  };

  if (isNaN(data.lat) || isNaN(data.lng)) { showToast('Please enter valid coordinates.', 'error'); return; }
  if (isNaN(data.pricePerHour) || data.pricePerHour < 1) { showToast('Please enter a valid price.', 'error'); return; }
  if (isNaN(data.totalSlots) || data.totalSlots < 1) { showToast('Please enter valid slot count.', 'error'); return; }
  if (isNaN(data.availableSlots) || data.availableSlots < 0) { showToast('Available slots cannot be negative.', 'error'); return; }

  const btn = document.getElementById('sf-submit');
  btn.innerHTML = '<span class="spinner"></span> Saving&hellip;';
  btn.disabled  = true;

  setTimeout(() => {
    if (editingSpotId) {
      updateSpot(editingSpotId, data);
      showToast('Spot updated successfully.', 'success');
    } else {
      addSpot(data);
      showToast('New spot added successfully.', 'success');
    }
    closeModal('spot-modal');
    loadSpots();
    loadDashboard();
    loadLog();
    btn.innerHTML = editingSpotId ? 'Update Spot' : 'Add Spot';
    btn.disabled  = false;
  }, 600);
}

// ─── Delete ───────────────────────────────────────────────────────────────────
let deleteTargetId = null;
function confirmDelete(spotId) {
  deleteTargetId = spotId;
  openModal('del-modal');
  document.getElementById('del-confirm-btn').onclick = () => {
    deleteSpot(spotId);
    closeModal('del-modal');
    loadSpots();
    loadDashboard();
    loadLog();
    showToast('Spot deleted.', 'info');
  };
}
