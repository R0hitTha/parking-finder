/**
 * ParkFinder — Home Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroEl      = document.getElementById('hero-splash');
  const mapSection  = document.getElementById('map-section');
  const loadingEl   = document.getElementById('map-loading');
  const searchInput = document.getElementById('search-input');
  const suggestEl   = document.getElementById('search-suggestions');
  const gpsBtn      = document.getElementById('gps-btn');
  const listBtn     = document.getElementById('view-list-btn');

  // ── Hero Stats Counters ─────────────────────────────────────────────────
  const spots      = getAllSpots();
  const availCount = spots.filter(s => s.availableSlots > 0).length;
  const avgPrice   = Math.round(spots.reduce((s, sp) => s + sp.pricePerHour, 0) / spots.length);

  animateCounter('hs-spots', spots.length);
  animateCounter('hs-avail', availCount);

  const priceEl = document.getElementById('hs-price');
  if (priceEl) {
    setTimeout(() => { priceEl.textContent = '\u20B9' + avgPrice; }, 400);
  }

  // ── Hero to Map Transition ────────────────────────────────────────────────
  let mapInitialized = false;

  function showMap(withGPS = false) {
    if (heroEl) heroEl.classList.add('hidden');
    if (mapSection) mapSection.classList.remove('hidden');

    if (!mapInitialized) {
      mapInitialized = true;
      initMap('main-map');

      setTimeout(() => {
        const allSpots = getAllSpots();
        renderMarkers(allSpots);
        updateRibbonStats(allSpots);
        if (loadingEl) setTimeout(() => loadingEl.classList.add('hidden'), 600);

        if (withGPS) {
          requestUserLocation((lat, lng) => {
            userLat = lat; userLng = lng;
            renderMarkers(getSpotsWithDistance(lat, lng));
          });
        }
      }, 800);
    }
  }

  document.getElementById('hero-explore-btn')?.addEventListener('click', () => showMap(false));
  document.getElementById('hero-gps-btn')?.addEventListener('click', () => showMap(true));

  // ── GPS button (in map panel) ────────────────────────────────────────────
  gpsBtn?.addEventListener('click', () => {
    requestUserLocation((lat, lng) => {
      userLat = lat; userLng = lng;
      renderMarkers(getSpotsWithDistance(lat, lng));
    });
  });

  listBtn?.addEventListener('click', () => { window.location.href = 'parking-list.html'; });

  // ── Search ────────────────────────────────────────────────────────────────
  let searchTimeout;
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { suggestEl.classList.remove('show'); return; }

    searchTimeout = setTimeout(() => {
      const results = getAllSpots().filter(s =>
        s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
      ).slice(0, 5);

      if (!results.length) { suggestEl.classList.remove('show'); return; }

      suggestEl.innerHTML = results.map(s => {
        const av = getAvailabilityStatus(s);
        const typeLabel = s.type === 'covered' ? 'Covered' : 'Open Air';
        return `
          <div class="suggestion-item" data-id="${s.id}" data-lat="${s.lat}" data-lng="${s.lng}">
            <span class="suggestion-icon">${typeLabel[0]}</span>
            <div>
              <div class="suggestion-name">${s.name}</div>
              <div class="suggestion-addr">${s.address} &middot; ${formatPrice(s.pricePerHour)}/hr
                <span class="badge badge-${av.cls}" style="font-size:0.68rem;margin-left:4px">${av.label}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
      suggestEl.classList.add('show');
    }, 220);
  });

  suggestEl?.addEventListener('click', e => {
    const item = e.target.closest('.suggestion-item');
    if (!item) return;
    const spot = getSpotById(item.dataset.id);
    if (spot) {
      if (!mapInitialized) showMap(false);
      setTimeout(() => { flyToSpot(spot); }, mapInitialized ? 0 : 1200);
      searchInput.value = spot.name;
      suggestEl.classList.remove('show');
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-panel')) suggestEl?.classList.remove('show');
  });

  document.getElementById('search-submit')?.addEventListener('click', () => {
    const q = searchInput?.value.trim().toLowerCase();
    if (!q) return;
    const spot = getAllSpots().find(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
    if (spot) {
      if (!mapInitialized) showMap(false);
      setTimeout(() => { flyToSpot(spot); suggestEl?.classList.remove('show'); }, mapInitialized ? 0 : 1200);
    } else {
      showToast('No parking spot found for that search.', 'info');
    }
  });

  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('search-submit')?.click();
  });

  // ── Live updates ─────────────────────────────────────────────────────────
  setInterval(() => {
    if (!mapInitialized) return;
    simulateAvailabilityUpdate();
    const updated = getAllSpots();
    renderMarkers(updated);
    updateRibbonStats(updated);
  }, 30000);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function updateRibbonStats(spots) {
  const stat_spots = document.getElementById('stat-spots');
  const stat_avg   = document.getElementById('stat-avg');
  const stat_avail = document.getElementById('stat-avail');
  const stat_live  = document.getElementById('stat-live');
  const count = spots.filter(s => s.availableSlots > 0).length;
  const avg   = Math.round(spots.reduce((s, sp) => s + sp.pricePerHour, 0) / spots.length);
  if (stat_spots) stat_spots.textContent = spots.length;
  if (stat_avg)   stat_avg.textContent   = '\u20B9' + avg;
  if (stat_avail) stat_avail.textContent = count;
  if (stat_live)  stat_live.textContent  = spots.length;
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start;
    if (start >= target) clearInterval(timer);
  }, 30);
}
