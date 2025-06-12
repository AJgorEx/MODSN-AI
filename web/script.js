async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, { credentials: 'include', ...opts });
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
  // 3D tilt effect
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (y / rect.height) * -15;
      const rotateY = (x / rect.width) * 15;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });

  // parallax scrolling
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.parallax').forEach(el => {
      const speed = parseFloat(el.dataset.speed || '0.5');
      const offset = window.scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  });
});
