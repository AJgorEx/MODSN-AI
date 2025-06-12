document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();

  const stats = await fetchJSON('/stats');
  if (stats)
    document.getElementById('stats').textContent = `Bot on ${stats.botGuilds} servers`;

  const list = document.getElementById('guilds');
  const invite = document.getElementById('invite');
  const search = document.getElementById('search');
  const guilds = await fetchJSON('/guilds');
  let allGuilds = [];

  function render(filter = '') {
    list.innerHTML = '';
    const lower = filter.toLowerCase();
    allGuilds
      .filter(g => g.name.toLowerCase().includes(lower))
      .forEach(g => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = g.name;
        const isAdmin = g.owner || (BigInt(g.permissions) & 0x8n) === 0x8n;
        link.href = isAdmin ? `admin.html?guildId=${g.id}` : 'user.html';
        li.appendChild(link);
        if (isAdmin) {
          const info = document.createElement('a');
          info.className = 'btn btn-sm';
          info.textContent = 'Info';
          info.href = `server-info.html?guildId=${g.id}`;
          li.appendChild(info);
        }
        list.appendChild(li);
      });
  }

  if (Array.isArray(guilds)) {
    allGuilds = guilds;
    render();
    if (search) {
      search.addEventListener('input', () => render(search.value));
    }
    invite.innerHTML = '<a class="btn" href="/invite">Add Bot to Server</a>';
  }
});
