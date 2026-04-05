/**
 * ParkFinder — Auth Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Redirect if already logged in
  const user = getCurrentUser();
  if (user) {
    const redir = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
    window.location.href = redir;
    return;
  }

  // ── Password Toggle ──────────────────────────────────────────────────────────
  function initPasswordToggle(inputId, btnId) {
    const input = document.getElementById(inputId);
    const btn   = document.getElementById(btnId);
    if (!input || !btn) return;
    btn.addEventListener('click', () => {
      const visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      // Swap SVG icon between eye-open and eye-closed
      btn.innerHTML = visible
        ? `<svg class="eye-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg class="eye-closed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    });
  }
  initPasswordToggle('login-password', 'login-pw-toggle');
  initPasswordToggle('signup-password', 'signup-pw-toggle');

  // ── Password Strength ────────────────────────────────────────────────────────
  const pwInput = document.getElementById('signup-password');
  pwInput?.addEventListener('input', () => {
    const pw    = pwInput.value;
    const len   = pw.length;
    const bars  = [1,2,3].map(i => document.getElementById('pw-bar-' + i));
    const label = document.getElementById('pw-label');
    let strength = 0;
    if (len >= 6) strength = 1;
    if (len >= 8 && /[A-Z]/.test(pw)) strength = 2;
    if (len >= 10 && /[A-Z]/.test(pw) && /[0-9!@#$%]/.test(pw)) strength = 3;

    const cls = ['', 'weak', 'fair', 'strong'][strength];
    const lbl = ['Enter a password', 'Weak', 'Fair', 'Strong'][strength];
    bars.forEach((b, i) => {
      if (b) b.className = 'pw-bar ' + (i < strength ? cls : '');
    });
    if (label) label.textContent = lbl;
  });

  // ── Validation ────────────────────────────────────────────────────────────────
  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg; el.classList.toggle('show', !!msg);
    const input = el.previousElementSibling?.querySelector('.form-input') || el.previousElementSibling;
    if (input?.classList) input.classList.toggle('error', !!msg);
  }

  // ── Login ─────────────────────────────────────────────────────────────────────
  document.getElementById('form-login')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pw    = document.getElementById('login-password').value;
    let valid   = true;

    showErr('login-email-err', '');
    showErr('login-pw-err', '');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showErr('login-email-err', 'Please enter a valid email address.'); valid = false;
    }
    if (!pw || pw.length < 4) {
      showErr('login-pw-err', 'Please enter your password.'); valid = false;
    }
    if (!valid) return;

    const btn = document.getElementById('login-submit');
    btn.innerHTML = '<span class="spinner"></span> Logging in&hellip;';
    btn.disabled  = true;

    setTimeout(() => {
      const result = loginUser(email, pw);
      if (result.success) {
        showToast(`Welcome back, ${result.user.name}!`, 'success');
        const redirect = result.user.role === 'admin' ? 'admin.html' : 'index.html';
        setTimeout(() => { window.location.href = redirect; }, 1000);
      } else {
        showErr('login-pw-err', result.error);
        btn.innerHTML = 'Login &rarr;';
        btn.disabled  = false;
      }
    }, 800);
  });

  // ── Signup ────────────────────────────────────────────────────────────────────
  document.getElementById('form-signup')?.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('signup-name').value.trim();
    const email   = document.getElementById('signup-email').value.trim();
    const pw      = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    let valid     = true;

    ['signup-name-err','signup-email-err','signup-pw-err','signup-confirm-err'].forEach(id => showErr(id, ''));

    if (!name || name.length < 2)             { showErr('signup-name-err',    'Please enter your full name.'); valid = false; }
    if (!email || !/\S+@\S+\.\S+/.test(email)){ showErr('signup-email-err',   'Please enter a valid email.'); valid = false; }
    if (pw.length < 6)                         { showErr('signup-pw-err',      'Password must be at least 6 characters.'); valid = false; }
    if (pw !== confirm)                         { showErr('signup-confirm-err', 'Passwords do not match.'); valid = false; }
    if (!valid) return;

    const btn = document.getElementById('signup-submit');
    btn.innerHTML = '<span class="spinner"></span> Creating account&hellip;';
    btn.disabled  = true;

    setTimeout(() => {
      const result = registerUser(name, email, pw);
      if (result.success) {
        showToast(`Account created! Welcome, ${result.user.name}.`, 'success');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
      } else {
        showErr('signup-email-err', result.error);
        btn.innerHTML = 'Create Account &rarr;';
        btn.disabled  = false;
      }
    }, 800);
  });
});

// ── Tab Switcher ──────────────────────────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('form-login').classList.toggle('active', tab === 'login');
  document.getElementById('form-signup').classList.toggle('active', tab === 'signup');
}
