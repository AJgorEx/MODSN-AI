document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  const params = new URLSearchParams(window.location.search);
  const guildId = params.get('guildId');
  if (!guildId) {
    window.location.replace('servers.html');
    return;
  }
  const list = document.getElementById('commands');
  const header = document.getElementById('server-name');
  try {
    const guilds = await fetchJSON('/guilds');
    const guild = guilds.find(g => g.id === guildId);
    if (guild && header) header.textContent = `Commands - ${guild.name}`;
  } catch (_) {}
  const data = await fetchJSON(`/command-status/${guildId}`);
  if (data) {
    Object.entries(data).forEach(([name, enabled]) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = name;
      const label = document.createElement('label');
      label.className = 'switch';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = enabled;
      const slider = document.createElement('span');
      slider.className = 'slider';
      label.appendChild(input);
      label.appendChild(slider);
      input.addEventListener('change', async () => {
        await fetch(`/command-status/${guildId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: name, enabled: input.checked })
        });
      });
      li.appendChild(span);
      li.appendChild(label);
      list.appendChild(li);
    });
  }
});
