document.addEventListener('DOMContentLoaded', async () => {
  const user = await loadUserInfo();

  const stats = await fetchJSON('/stats');
  if (stats)
    document.getElementById('stats').textContent = `Bot on ${stats.botGuilds} servers`;

  const list = document.getElementById('guilds');
  const invite = document.getElementById('invite');
  const guilds = await fetchJSON('/guilds');
  if (guilds) {
    guilds.forEach(g => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = g.name;
      const isAdmin = g.owner || (BigInt(g.permissions) & 0x8n) === 0x8n;
      link.href = isAdmin ? `admin.html?guildId=${g.id}` : 'user.html';
      li.appendChild(link);
      list.appendChild(li);
    });
    invite.innerHTML = '<a class="btn" href="/invite">Add Bot to Server</a>';
  }
});
