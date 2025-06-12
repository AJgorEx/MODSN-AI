document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  const params = new URLSearchParams(window.location.search);
  const guildId = params.get('guildId');
  if (!guildId) {
    window.location.replace('servers.html');
    return;
  }
  const list = document.getElementById('roles');
  const header = document.getElementById('server-name');
  const manage = document.getElementById('manageRoles');
  try {
    const guilds = await fetchJSON('/guilds');
    const guild = guilds.find(g => g.id === guildId);
    if (guild && header) header.textContent = `Roles - ${guild.name}`;
  } catch (_) {}
  const roles = await fetchJSON(`/roles/${guildId}`);
  if (roles) {
    roles.forEach(role => {
      const li = document.createElement('li');
      li.textContent = role.name;
      list.appendChild(li);
    });
  }
  if (manage) manage.href = `role-manager.html?guildId=${guildId}`;
});
