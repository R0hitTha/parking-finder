/**
 * ParkFinder — Parking List Page Logic
 */

let currentView = 'grid';
let filters = {
  search: '',
  maxPrice: 150,
  maxDist: 50,
  type: 'all',
  avail: 'all',
  rating: 0,
  amenity: null,
};
let userLat = null, userLng = null;

document.addEventListener('DOMContentLoaded', () => {
  const container    = document.getElementById('cards-container');
  const countEl      = document.getElementById('results-count');
  const heroCount    = document.getElementById('hero-count');
  const searchInput  = document.getElementById('list-search');
  const priceRange   = document.getElementById('price-range');
  const distRange    = document.getElementById('dist-range');
  const sortSelect   = document.getElementById('sort-select');
  const gridBtn      = document.getElementById('grid-btn');
  const listBtn      = document.getElementById('list-btn');
  const clearBtn     = document.getElementById('filter-clear');
  const filterToggle = document.getElementById('filter-toggle');
  const filterSide   = document.getElementById('filter-sidebar');

  if (heroCount) heroCount.textContent = getAllSpots().length;

  // ── Geolocation ──────────────────────────────────────────────────────────
  userLat = 19.0760; userLng = 72.8777;
  render();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => { userLat = pos.coords.latitude; userLng = pos.coords.longitude; render(); },
      () => {}
    );
  }

  // Check favourites filter from URL
  const params = new URLSearchParams(window.location.search);
  if (params.get('filter') === 'favorites') {
    filters.favOnly = true;
    document.querySelector('.results-count')?.previousElementSibling?.insertAdjacentHTML('afterend',
      `<span class="badge badge-available" style="margin-left:8px">Favourites Only</span>`
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function render() {
    let spots = getAllSpots();

    // Attach distance
    if (userLat && userLng) {
      spots = spots.map(s => ({ ...s, distance: calculateDistance(userLat, userLng, s.lat, s.lng) }));
    } else {
      spots = spots.map(s => ({ ...s, distance: 999 }));
    }

    // Favourites filter
    if (filters.favOnly) {
      const favs = getFavorites();
      spots = spots.filter(s => favs.includes(s.id));
    }

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      spots = spots.filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
    }

    // Price
    spots = spots.filter(s => s.pricePerHour <= filters.maxPrice);

    // Distance
    if (filters.maxDist < 50) {
      spots = spots.filter(s => s.distance <= filters.maxDist);
    }

    // Type
    if (filters.type !== 'all') spots = spots.filter(s => s.type === filters.type);

    // Availability
    if (filters.avail === 'available') spots = spots.filter(s => s.availableSlots > 0 && (s.availableSlots / s.totalSlots) >= 0.2);
    if (filters.avail === 'limited')   spots = spots.filter(s => s.availableSlots > 0 && (s.availableSlots / s.totalSlots) < 0.2);

    // Rating
    if (filters.rating > 0) spots = spots.filter(s => s.rating >= filters.rating);

    // Amenity
    if (filters.amenity) spots = spots.filter(s => s.amenities && s.amenities.includes(filters.amenity));

    // Sort
    const sortVal = sortSelect?.value || 'distance';
    if (sortVal === 'distance')     spots.sort((a, b) => a.distance - b.distance);
    if (sortVal === 'price-asc')    spots.sort((a, b) => a.pricePerHour - b.pricePerHour);
    if (sortVal === 'price-desc')   spots.sort((a, b) => b.pricePerHour - a.pricePerHour);
    if (sortVal === 'rating')       spots.sort((a, b) => b.rating - a.rating);
    if (sortVal === 'availability') spots.sort((a, b) => b.availableSlots - a.availableSlots);

    if (countEl) countEl.textContent = spots.length;

    if (spots.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon-text">P</div>
          <h3>No parking spots found</h3>
          <p>Try adjusting your filters or search term.</p>
          <button class="btn btn-primary mt-4" onclick="clearFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = spots.map(s => renderParkingCard(s, userLat, userLng)).join('');
    initFavButtons(container);

    container.querySelectorAll('.park-card').forEach((el, i) => {
      el.style.animationDelay = (i * 0.04) + 's';
    });
  }

  // ── Filter Listeners ──────────────────────────────────────────────────────

  searchInput?.addEventListener('input', () => { filters.search = searchInput.value; render(); });
  document.getElementById('list-search-btn')?.addEventListener('click', () => { filters.search = searchInput.value; render(); });

  priceRange?.addEventListener('input', () => {
    const v = +priceRange.value;
    filters.maxPrice = v;
    document.getElementById('price-val').textContent = v >= 150 ? 'Any' : '\u20B9' + v;
    const pct = ((v - 0) / (150 - 0)) * 100;
    priceRange.style.setProperty('--val', pct + '%');
    render();
  });

  distRange?.addEventListener('input', () => {
    const v = +distRange.value;
    filters.maxDist = v;
    document.getElementById('dist-val').textContent = v >= 50 ? 'Any' : v + ' km';
    const pct = ((v - 1) / (50 - 1)) * 100;
    distRange.style.setProperty('--val', pct + '%');
    render();
  });

  document.querySelectorAll('[data-type]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-type]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filters.type = chip.dataset.type;
      render();
    });
  });

  document.querySelectorAll('[data-avail]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-avail]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filters.avail = chip.dataset.avail;
      render();
    });
  });

  document.querySelectorAll('[data-rating]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-rating]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filters.rating = +chip.dataset.rating;
      render();
    });
  });

  document.querySelectorAll('[data-amenity]').forEach(chip => {
    chip.addEventListener('click', () => {
      const isActive = chip.classList.contains('active');
      document.querySelectorAll('[data-amenity]').forEach(c => c.classList.remove('active'));
      if (!isActive) { chip.classList.add('active'); filters.amenity = chip.dataset.amenity; }
      else { filters.amenity = null; }
      render();
    });
  });

  sortSelect?.addEventListener('change', render);

  gridBtn?.addEventListener('click', () => {
    currentView = 'grid';
    container.className = 'cards-grid';
    gridBtn.classList.add('active'); listBtn.classList.remove('active');
  });
  listBtn?.addEventListener('click', () => {
    currentView = 'list';
    container.className = 'cards-list';
    listBtn.classList.add('active'); gridBtn.classList.remove('active');
  });

  clearBtn?.addEventListener('click', () => clearFilters());
  filterToggle?.addEventListener('click', () => filterSide.classList.toggle('show'));

  // ── Live Updates ──────────────────────────────────────────────────────────
  setInterval(() => { simulateAvailabilityUpdate(); render(); }, 30000);
});

function clearFilters() {
  filters = { search: '', maxPrice: 150, maxDist: 50, type: 'all', avail: 'all', rating: 0, amenity: null };
  document.getElementById('list-search').value  = '';
  document.getElementById('price-range').value  = 150;
  document.getElementById('dist-range').value   = 50;
  document.getElementById('price-val').textContent = 'Any';
  document.getElementById('dist-val').textContent  = 'Any';
  document.querySelectorAll('[data-type]').forEach((c,i)   => c.classList.toggle('active', i===0));
  document.querySelectorAll('[data-avail]').forEach((c,i)  => c.classList.toggle('active', i===0));
  document.querySelectorAll('[data-rating]').forEach((c,i) => c.classList.toggle('active', i===0));
  document.querySelectorAll('[data-amenity]').forEach(c => c.classList.remove('active'));
  document.getElementById('sort-select').value = 'distance';
  window.location.href = 'parking-list.html';
}
