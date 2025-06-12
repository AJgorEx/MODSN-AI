async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, { credentials: 'include', ...opts });
  if (res.status === 401) {
    window.location.replace('/login');
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

async function loadUserInfo() {
  try {
    const user = await fetchJSON('/me');
    const nameEl = document.getElementById('username');
    const avatarEl = document.getElementById('avatar');
    if (nameEl) nameEl.textContent = user.username;
    if (avatarEl) {
      const ext = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
      avatarEl.src = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=64`
        : `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.discriminator) || 0) % 5}.png`;
    }
    return user;
  } catch (_) {
    if (!['/', '/index.html'].includes(window.location.pathname)) {
      window.location.replace('/');
    }
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // no animations
});

function notify(type, msg) {
  const container = document.getElementById('notifications');
  if (!container) return;
  const div = document.createElement('div');
  div.className = `toast ${type}`;
  const icons = { success: '✔️', error: '❌', info: 'ℹ️' };
  div.innerHTML = `<span class="icon">${icons[type] || ''}</span> ${msg}`;
  container.appendChild(div);
  requestAnimationFrame(() => div.classList.add('show'));
  setTimeout(() => {
    div.classList.remove('show');
    div.addEventListener('transitionend', () => div.remove());
  }, 3000);
}
