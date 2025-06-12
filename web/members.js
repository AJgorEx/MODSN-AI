document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  const params = new URLSearchParams(window.location.search);
  const guildId = params.get('guildId');
  if (!guildId) {
    window.location.replace('servers.html');
    return;
  }
  const list = document.getElementById('members');
  const header = document.getElementById('server-name');
  try {
    const guilds = await fetchJSON('/guilds');
    const guild = guilds.find(g => g.id === guildId);
    if (guild && header) header.textContent = `Members - ${guild.name}`;
  } catch (_) {}
  const members = await fetchJSON(`/members/${guildId}`);
  if (members) {
    members.forEach(m => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.gap = '0.5rem';
      const img = document.createElement('img');
      img.className = 'avatar';
      img.style.width = '32px';
      img.style.height = '32px';
      img.src = m.avatar;
      const span = document.createElement('span');
      span.textContent = m.username;
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm';
      btn.textContent = 'DM';
      btn.addEventListener('click', async () => {
        const msg = prompt('Enter message to send via bot');
        if (!msg) return;
        try {
          await fetchJSON(`/dm/${m.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
          });
          notify('success', 'DM sent');
        } catch (err) {
          notify('error', err.message);
        }
      });
      li.appendChild(img);
      li.appendChild(span);
      li.appendChild(btn);
      list.appendChild(li);
    });
  }
});
