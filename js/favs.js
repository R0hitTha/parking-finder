/**
 * ParkFinder — Favourites Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('favs-container');
  const countEl   = document.getElementById('favs-count');
  const clearBtn  = document.getElementById('clear-all-btn');

  const user = getCurrentUser();

  if (!user) {
    container.innerHTML = `
      <div class="favs-empty animate-in">
        <div class="favs-empty-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2>Sign in to view your favourites</h2>
        <p>Create a free account to save parking spots and access them from any device.</p>
        <a href="login.html" class="btn btn-primary btn-lg">Login / Sign Up</a>
      </div>
    `;
    return;
  }

  renderFavourites();

  // Clear All
  clearBtn?.addEventListener('click', () => {
    if (!confirm('Remove all saved favourites?')) return;
    const favs = JSON.parse(localStorage.getItem('pf_favorites') || '{}');
    favs[user.id] = [];
    localStorage.setItem('pf_favorites', JSON.stringify(favs));
    showToast('All favourites cleared.', 'info');
    renderFavourites();
  });

  // Re-render on fav toggle
  container.addEventListener('click', e => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;
    const added = toggleFavorite(btn.dataset.id);
    if (!added) {
      const card = btn.closest('.park-card');
      if (card) {
        card.classList.add('removing');
        setTimeout(() => renderFavourites(), 360);
      }
      showToast('Removed from favourites.', 'info');
    } else {
      const svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', 'currentColor');
      btn.classList.add('active');
      showToast('Added to favourites.', 'success');
    }
  });

  function renderFavourites() {
    const favIds   = getFavorites();
    const allSpots = getAllSpots();
    const favSpots = allSpots.filter(s => favIds.includes(s.id));

    if (countEl) countEl.textContent = favSpots.length;
    if (clearBtn) clearBtn.style.display = favSpots.length > 0 ? 'inline-flex' : 'none';

    if (favSpots.length === 0) {
      container.innerHTML = `
        <div class="favs-empty animate-in">
          <div class="favs-empty-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h2>No favourites saved yet</h2>
          <p>Click the heart icon on any parking spot to save it here for quick access.</p>
          <a href="parking-list.html" class="btn btn-primary btn-lg">Browse Parking Spots</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `<div class="favs-grid">${favSpots.map(s => renderParkingCard(s, null, null)).join('')}</div>`;

    container.querySelectorAll('.park-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.animationDelay = (i * 0.06) + 's';
      el.classList.add('animate-in');
    });
  }
});
