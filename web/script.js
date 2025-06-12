// helper for API calls
window.fetchJSON = async function (url) {
  try {
    const r = await fetch(url, { credentials: 'same-origin' });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return await r.json();
  } catch (err) {
    console.error('fetchJSON', err);
    return {};
  }
};

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
