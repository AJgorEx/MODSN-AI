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
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = g.name;
      btn.className = 'link';
      btn.onclick = () => (location.href = `admin.html?guildId=${g.id}`);
      li.appendChild(btn);
      list.appendChild(li);
    });
    invite.innerHTML = "<button type='button' class='btn' onclick=\"location.href='/invite'\">Add Bot to Server</button>";
  }
});
