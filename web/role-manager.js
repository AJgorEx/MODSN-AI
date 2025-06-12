document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  const params = new URLSearchParams(window.location.search);
  const guildId = params.get('guildId');
  if (!guildId) {
    window.location.replace('servers.html');
    return;
  }
  const memberSelect = document.getElementById('member');
  const roleSelect = document.getElementById('role');
  const header = document.getElementById('server-name');
  try {
    const guilds = await fetchJSON('/guilds');
    const guild = guilds.find(g => g.id === guildId);
    if (guild && header) header.textContent = `Role Manager - ${guild.name}`;
  } catch (_) {}
  const members = await fetchJSON(`/members/${guildId}`);
  if (members)
    members.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.username;
      memberSelect.appendChild(opt);
    });
  const roles = await fetchJSON(`/roles/${guildId}`);
  if (roles)
    roles.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = r.name;
      roleSelect.appendChild(opt);
    });
  document.querySelectorAll('#roleForm button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const body = {
        memberId: memberSelect.value,
        roleId: roleSelect.value,
        action: btn.dataset.action
      };
      await fetch(`/member-role/${guildId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      alert('Done');
    });
  });
});
