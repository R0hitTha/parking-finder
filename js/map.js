/**
 * ParkFinder — Leaflet Map Engine
 */

let map, userMarker, markersLayer = [];
let userLat = null, userLng = null;

const DEFAULT_CENTER = [22.5, 82.0]; // Geographic center of India
const DEFAULT_ZOOM   = 5;

// ─── Init Map ─────────────────────────────────────────────────────────────────
function initMap(containerId = 'main-map') {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

  map = L.map(containerId, {
    zoomControl: false,
    attributionControl: true,
  }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

  const darkTile  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const lightTile = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  L.tileLayer(isDark ? darkTile : lightTile, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Watch theme changes to swap tiles
  const observer = new MutationObserver(() => {
    const t = document.documentElement.getAttribute('data-theme') !== 'light' ? darkTile : lightTile;
    map.eachLayer(l => { if (l instanceof L.TileLayer) map.removeLayer(l); });
    L.tileLayer(t, { subdomains: 'abcd', maxZoom: 19 }).addTo(map);
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  return map;
}

// ─── Custom Marker Icon ───────────────────────────────────────────────────────
function createMarkerIcon(spot) {
  const avail = getAvailabilityStatus(spot);
  const colors = { available: '#22c55e', limited: '#f59e0b', full: '#ef4444' };
  const color  = colors[avail.cls];
  const slots  = spot.availableSlots > 99 ? '99+' : spot.availableSlots;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:42px;height:42px;
        background:${color};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 14px rgba(0,0,0,0.45);
        border:2.5px solid rgba(255,255,255,0.35);
        cursor:pointer;
      ">
        <span style="transform:rotate(45deg);font-size:0.72rem;font-weight:800;color:#fff;">${avail.cls === 'full' ? 'X' : slots}</span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -46],
  });
}

// ─── Popup Content ────────────────────────────────────────────────────────────
function createPopupContent(spot) {
  const avail     = getAvailabilityStatus(spot);
  const dist      = (userLat && userLng) ? ` &middot; ${formatDistance(calculateDistance(userLat, userLng, spot.lat, spot.lng))}` : '';
  const typeLabel = spot.type === 'covered' ? 'Covered' : 'Open Air';
  return `
    <div class="map-popup">
      <div class="map-popup-name">${spot.name}</div>
      <div class="map-popup-row">
        <span class="badge badge-${spot.type}" style="font-size:0.7rem">${typeLabel}</span>
        <span class="badge badge-${avail.cls}" style="font-size:0.7rem">${avail.label}</span>
      </div>
      <div class="map-popup-row"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="color:#f59e0b;vertical-align:-1px;margin-right:3px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${spot.rating} (${spot.reviewCount} reviews)${dist}</div>
      <div class="map-popup-price">${formatPrice(spot.pricePerHour)}<span style="font-size:0.8rem;font-weight:400;color:var(--text-2)">/hr</span></div>
      <div class="map-popup-footer">
        <a href="https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}"
           target="_blank" class="btn btn-secondary" style="flex:1;font-size:0.78rem;padding:6px 8px">
           Navigate
        </a>
        <a href="details.html?id=${spot.id}"
           class="btn btn-primary" style="flex:1;font-size:0.78rem;padding:6px 8px">
           Details &rarr;
        </a>
      </div>
    </div>
  `;
}

// ─── Render All Markers ───────────────────────────────────────────────────────
function renderMarkers(spots) {
  markersLayer.forEach(m => map.removeLayer(m));
  markersLayer = [];

  spots.forEach((spot, i) => {
    const marker = L.marker([spot.lat, spot.lng], {
      icon: createMarkerIcon(spot),
    });
    marker.bindPopup(createPopupContent(spot), { maxWidth: 260, className: 'custom-popup' });

    // Staggered animation effect via delayed add
    setTimeout(() => { marker.addTo(map); }, i * 40);
    markersLayer.push(marker);
  });
}

// ─── User Location Marker ─────────────────────────────────────────────────────
function setUserMarker(lat, lng) {
  userLat = lat; userLng = lng;
  if (userMarker) map.removeLayer(userMarker);

  const icon = L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:18px;height:18px;">
        <div style="width:18px;height:18px;border-radius:50%;background:#00c3ff;border:3px solid #fff;box-shadow:0 0 0 4px rgba(0,195,255,0.3);"></div>
        <div style="position:absolute;inset:-6px;border-radius:50%;border:2px solid rgba(0,195,255,0.4);animation:pulse 1.5s ease infinite;"></div>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  userMarker = L.marker([lat, lng], { icon, zIndexOffset: 1000 }).addTo(map);
  userMarker.bindPopup('<div style="padding:8px;font-size:0.85rem;font-weight:600">Your Location</div>');
}

// ─── Geolocation ──────────────────────────────────────────────────────────────
function requestUserLocation(callback) {
  if (!navigator.geolocation) {
    showToast('Geolocation not supported by your browser.', 'error');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      setUserMarker(latitude, longitude);
      map.flyTo([latitude, longitude], 13, { animate: true, duration: 1.2 });
      showToast('Location detected successfully.', 'success');
      if (callback) callback(latitude, longitude);
    },
    () => {
      showToast('Could not detect location. Using Mumbai as default.', 'info');
      if (callback) callback(...DEFAULT_CENTER);
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

// ─── Fly to Spot ──────────────────────────────────────────────────────────────
function flyToSpot(spot) {
  map.flyTo([spot.lat, spot.lng], 16, { animate: true, duration: 1 });
  const marker = markersLayer.find(m => {
    const pos = m.getLatLng();
    return Math.abs(pos.lat - spot.lat) < 0.0001 && Math.abs(pos.lng - spot.lng) < 0.0001;
  });
  if (marker) setTimeout(() => marker.openPopup(), 1000);
}
