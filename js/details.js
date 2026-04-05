/**
 * ParkFinder — Details Page Logic
 */

const AMENITY_ICONS = {
  'CCTV':       'CCTV',
  'EV Charging':'EV',
  'Valet':      'Valet',
  'Security':   'Security',
  '24/7':       '24/7',
  'Car Wash':   'Car Wash',
};

// SVG star helper (filled/empty)
function renderStarsSVG(filled, total) {
  let html = '';
  for (let i = 0; i < total; i++) {
    const f = i < filled;
    html += `<svg width="13" height="13" viewBox="0 0 24 24" fill="${f ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" style="color:#f59e0b;vertical-align:-1px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
  return html;
}

document.addEventListener('DOMContentLoaded', () => {
  const params  = new URLSearchParams(window.location.search);
  const spotId  = params.get('id');
  const content = document.getElementById('details-content');

  if (!spotId) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon-text">P</div><h3>No spot selected</h3><a href="parking-list.html" class="btn btn-primary mt-4">Browse Parking</a></div>`;
    return;
  }

  const spot = getSpotById(spotId);
  if (!spot) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon-text">!</div><h3>Spot not found</h3><a href="parking-list.html" class="btn btn-primary mt-4">Browse Parking</a></div>`;
    return;
  }

  document.title = `${spot.name} — ParkFinder`;

  // ── Mini Map ────────────────────────────────────────────────────────────────
  const miniMap = L.map('detail-mini-map', { zoomControl: false, scrollWheelZoom: false, dragging: false, attributionControl: false });
  const isDark  = document.documentElement.getAttribute('data-theme') !== 'light';
  L.tileLayer(
    isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
           : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    { subdomains: 'abcd', maxZoom: 18 }
  ).addTo(miniMap);
  miniMap.setView([spot.lat, spot.lng], 15);

  const icon = L.divIcon({
    className: '',
    html: `<div style="width:38px;height:38px;background:#00c3ff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 14px rgba(0,195,255,0.5)"></div>`,
    iconSize: [38,38], iconAnchor:[19,38],
  });
  L.marker([spot.lat, spot.lng], { icon }).addTo(miniMap);

  // ── Render Content ──────────────────────────────────────────────────────────
  renderDetails(spot);

  // Update tiles on theme switch
  new MutationObserver(() => {
    const dark = document.documentElement.getAttribute('data-theme') !== 'light';
    miniMap.eachLayer(l => { if (l instanceof L.TileLayer) miniMap.removeLayer(l); });
    L.tileLayer(dark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                     : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', maxZoom: 18 }).addTo(miniMap);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
});

function renderDetails(spot) {
  const avail  = getAvailabilityStatus(spot);
  const reviews = getReviewsForSpot(spot.id);
  const fav    = isFavorite(spot.id);
  const user   = getCurrentUser();

  const amenityHtml = (spot.amenities || []).map(a =>
    `<div class="amenity-chip">${AMENITY_ICONS[a] || a}</div>`
  ).join('');

  const reviewsHtml = reviews.length === 0
    ? `<p style="color:var(--text-2);font-size:0.9rem">No reviews yet. Be the first to review!</p>`
    : reviews.map(r => `
      <div class="review-item">
        <div class="reviewer-avatar">${r.userName.charAt(0)}</div>
        <div>
          <div class="reviewer-name">${r.userName} <span class="stars" style="font-size:0.8rem">${renderStarsSVG(r.rating, 5)}</span></div>
          <div class="reviewer-date">${r.date}</div>
          <div class="review-text">${r.comment}</div>
        </div>
      </div>
    `).join('');

  const addReviewHtml = user ? `
    <div class="add-review-form">
      <div class="section-head" style="font-size:0.9rem;margin-bottom:10px">Leave a Review</div>
      <div class="star-picker" id="star-picker">
        <span data-val="1">☆</span><span data-val="2">☆</span>
        <span data-val="3">☆</span><span data-val="4">☆</span><span data-val="5">☆</span>
      </div>
      <div class="form-group">
        <textarea id="review-text" class="form-input" rows="3" placeholder="Share your experience&hellip;" style="resize:vertical"></textarea>
      </div>
      <button class="btn btn-primary mt-3 btn-sm" id="submit-review">Submit Review</button>
    </div>
  ` : `<p style="color:var(--text-2);font-size:0.85rem;margin-top:12px"><a href="login.html">Login</a> to leave a review.</p>`;

  const typeLabel = spot.type === 'covered' ? 'Covered' : 'Open Air';

  document.getElementById('details-content').innerHTML = `
    <!-- Header Card -->
    <div class="details-header-card animate-in">
      <div class="details-header-top">
        <h1 class="details-name">${spot.name}</h1>
        <div class="details-actions">
          <button class="fav-btn-lg ${fav ? 'active' : ''}" id="fav-btn" title="Save favourite">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${fav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}" target="_blank" class="btn btn-outline btn-sm">Navigate</a>
        </div>
      </div>
      <div class="details-meta-row">
        <div class="details-badge-row">
          <span class="badge badge-${spot.type}">${typeLabel}</span>
          <span class="badge badge-${avail.cls}">${avail.label}</span>
        </div>
        <div class="rating-display">
          <span class="stars">${renderStarsSVG(Math.floor(spot.rating), 5)}</span>
          <strong>${spot.rating}</strong>
          <span style="color:var(--text-2);font-size:0.85rem">(${spot.reviewCount} reviews)</span>
        </div>
      </div>
      <p style="color:var(--text-2);font-size:0.9rem;margin-top:12px">${spot.address}</p>
      <p style="color:var(--text-2);font-size:0.87rem;margin-top:8px;line-height:1.6">${spot.description}</p>
    </div>

    <!-- Info Grid -->
    <div class="info-grid animate-in-2">
      <div class="info-card">
        <div class="info-card-icon">&#8377;</div>
        <div class="info-card-label">Per Hour</div>
        <div class="info-card-value accent">&#8377;${spot.pricePerHour}</div>
      </div>
      <div class="info-card">
        <div class="info-card-icon">Cal</div>
        <div class="info-card-label">Per Day</div>
        <div class="info-card-value accent">&#8377;${spot.pricePerDay}</div>
      </div>
      <div class="info-card">
        <div class="info-card-icon">Hrs</div>
        <div class="info-card-label">Hours</div>
        <div class="info-card-value" style="font-size:1rem">${spot.openTime} &ndash; ${spot.closeTime}</div>
      </div>
      <div class="info-card">
        <div class="info-card-icon">P</div>
        <div class="info-card-label">Total Slots</div>
        <div class="info-card-value">${spot.totalSlots}</div>
      </div>
    </div>

    <!-- Availability -->
    <div class="avail-section animate-in-3">
      <div class="avail-section-title">Real-time Availability <span class="live-dot" style="margin-left:8px"></span></div>
      <div class="avail-big">
        <span class="avail-big-num" style="color:${avail.cls === 'available' ? 'var(--success)' : avail.cls === 'limited' ? 'var(--warning)' : 'var(--danger)'}">${spot.availableSlots}</span>
        <span class="avail-big-label">of ${spot.totalSlots} slots available</span>
      </div>
      <div class="avail-bar-big"><div class="avail-fill-big avail-fill ${avail.cls}" style="width:${avail.pct}%"></div></div>
    </div>

    <!-- Action Bar -->
    <div class="action-bar animate-in-4">
      <a href="https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}" target="_blank" class="btn btn-secondary btn-lg">Get Directions</a>
      <button class="btn btn-primary btn-lg" id="book-btn" ${spot.availableSlots === 0 ? 'disabled' : ''}>
        ${spot.availableSlots === 0 ? 'No Slots Available' : 'Book Now'}
      </button>
    </div>

    <!-- Amenities -->
    ${spot.amenities?.length ? `
    <div class="amenities-section">
      <div class="section-head">Amenities</div>
      <div class="amenity-chips">${amenityHtml}</div>
    </div>` : ''}

    <!-- Reviews -->
    <div class="reviews-section">
      <div class="section-head">Reviews (${reviews.length})</div>
      ${reviewsHtml}
      ${addReviewHtml}
    </div>
  `;

  // ── Favourite Button ────────────────────────────────────────────────────────
  document.getElementById('fav-btn')?.addEventListener('click', () => {
    if (!getCurrentUser()) { showToast('Please login to save favourites.', 'error'); return; }
    const added = toggleFavorite(spot.id);
    const btn = document.getElementById('fav-btn');
    const svg = btn?.querySelector('svg');
    if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');
    btn?.classList.toggle('active', added);
    showToast(added ? 'Added to favourites.' : 'Removed from favourites.', added ? 'success' : 'info');
  });

  // ── Star Picker ─────────────────────────────────────────────────────────────
  let selectedRating = 0;
  document.querySelectorAll('#star-picker span').forEach(s => {
    s.addEventListener('mouseenter', () => {
      const val = +s.dataset.val;
      document.querySelectorAll('#star-picker span').forEach((sp, i) => {
        sp.textContent = i < val ? '★' : '☆';
        sp.classList.toggle('active', i < val);
      });
    });
    s.addEventListener('mouseleave', () => {
      document.querySelectorAll('#star-picker span').forEach((sp, i) => {
        sp.textContent = i < selectedRating ? '★' : '☆';
        sp.classList.toggle('active', i < selectedRating);
      });
    });
    s.addEventListener('click', () => { selectedRating = +s.dataset.val; });
  });

  document.getElementById('submit-review')?.addEventListener('click', () => {
    if (selectedRating === 0) { showToast('Please select a star rating.', 'error'); return; }
    const txt = document.getElementById('review-text').value.trim();
    if (!txt) { showToast('Please write a review comment.', 'error'); return; }
    const res = addReview(spot.id, selectedRating, txt);
    if (res.success) {
      showToast('Review submitted. Thank you!', 'success');
      renderDetails(getSpotById(spot.id));
    }
  });

  // ── Book Button ─────────────────────────────────────────────────────────────
  document.getElementById('book-btn')?.addEventListener('click', () => openBookingModal(spot));
}

// ─── Booking Modal ────────────────────────────────────────────────────────────
function openBookingModal(spot) {
  let hours = 2, payMethod = 'card';
  const update = () => {
    const total = hours * spot.pricePerHour;
    const tax   = Math.round(total * 0.18);
    document.getElementById('bk-hours-val').textContent = hours + (hours === 1 ? ' hour' : ' hours');
    document.getElementById('bk-subtotal').textContent = '\u20B9' + total;
    document.getElementById('bk-tax').textContent      = '\u20B9' + tax;
    document.getElementById('bk-total').textContent    = '\u20B9' + (total + tax);
  };

  document.getElementById('book-modal-content').innerHTML = `
    <div class="form-group" style="margin-bottom:16px">
      <div class="form-label">Duration</div>
      <div style="display:flex;align-items:center;gap:12px">
        <button class="btn btn-secondary btn-sm" id="bk-minus">&minus;</button>
        <span id="bk-hours-val" style="font-weight:700;min-width:80px;text-align:center">2 hours</span>
        <button class="btn btn-secondary btn-sm" id="bk-plus">+</button>
      </div>
    </div>
    <div class="book-summary">
      <div class="book-summary-row"><span>Spot</span><span>${spot.name}</span></div>
      <div class="book-summary-row"><span>Rate</span><span>&#8377;${spot.pricePerHour}/hr</span></div>
      <div class="book-summary-row"><span>Subtotal</span><span id="bk-subtotal">&#8377;${hours * spot.pricePerHour}</span></div>
      <div class="book-summary-row"><span>Tax (18% GST)</span><span id="bk-tax">&#8377;${Math.round(hours * spot.pricePerHour * 0.18)}</span></div>
      <div class="book-summary-row total"><span>Total</span><span id="bk-total">&#8377;${Math.round(hours * spot.pricePerHour * 1.18)}</span></div>
    </div>
    <div class="form-label" style="margin-bottom:8px">Payment Method</div>
    <div class="payment-methods">
      <div class="payment-pill active" data-pay="card">Card</div>
      <div class="payment-pill" data-pay="upi">UPI</div>
      <div class="payment-pill" data-pay="wallet">Wallet</div>
      <div class="payment-pill" data-pay="cash">Cash</div>
    </div>
    <button class="btn btn-primary w-full mt-4 btn-lg" id="confirm-booking">Confirm &amp; Pay</button>
  `;

  document.getElementById('bk-minus').addEventListener('click', () => { if (hours > 1) { hours--; update(); } });
  document.getElementById('bk-plus').addEventListener('click',  () => { if (hours < 24) { hours++; update(); } });

  document.querySelectorAll('[data-pay]').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('[data-pay]').forEach(pp => pp.classList.remove('active'));
      p.classList.add('active'); payMethod = p.dataset.pay;
    });
  });

  document.getElementById('confirm-booking').addEventListener('click', () => {
    if (!getCurrentUser()) { closeModal('book-modal'); window.location.href = 'login.html'; return; }
    const btn = document.getElementById('confirm-booking');
    btn.innerHTML = '<span class="spinner"></span> Processing&hellip;';
    btn.disabled  = true;
    setTimeout(() => {
      const ref = 'PF-' + Date.now().toString(36).toUpperCase();
      document.getElementById('booking-ref').textContent = ref;
      closeModal('book-modal');
      openModal('success-modal');
      updateSpot(spot.id, { availableSlots: Math.max(0, spot.availableSlots - 1) });
    }, 1800);
  });

  openModal('book-modal');
}
