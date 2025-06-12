async function fetchJSON(url) {
  const r = await fetch(url, { credentials: 'include' });
  if (!r.ok) {
    console.error('Failed to fetch', url, r.status);
    return null;
  }
  return r.json();
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = await fetchJSON('/me');
  if (user) {
    document.getElementById('username').textContent = user.username;
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
      : `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.discriminator) || 0) % 5}.png`;
    document.getElementById('avatar').src = avatarUrl;
  }

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
      link.href = `admin.html?guildId=${g.id}`;
      li.appendChild(link);
      list.appendChild(li);
    });
    invite.innerHTML = '<a class="btn" href="/invite">Add Bot to Server</a>';
  }
});
