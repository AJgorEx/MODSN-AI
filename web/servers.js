async function fetchJSON(url) {
  const r = await fetch(url, { credentials: 'include' });
  return r.ok ? r.json() : {};
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = await fetchJSON('/me');
  document.getElementById('username').textContent = user.username;
  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.discriminator) || 0) % 5}.png`;
  document.getElementById('avatar').src = avatarUrl;

  const stats = await fetchJSON('/stats');
  document.getElementById('stats').textContent = `Bot on ${stats.botGuilds} servers`;

  const list = document.getElementById('guilds');
  const invite = document.getElementById('invite');
  const guilds = await fetchJSON('/guilds');
  guilds.forEach(g => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = g.name;
    link.href = `admin.html?guildId=${g.id}`;
    li.appendChild(link);
    list.appendChild(li);
  });
  if (guilds.length === 0) {
    invite.innerHTML =
      '<a class="btn" href="https://discord.com/oauth2/authorize?client_id=1382682041283510272&permissions=8&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&integration_type=0&scope=identify+guilds+guilds.channels.read+bot">Add Bot to Server</a>';
  }
});
