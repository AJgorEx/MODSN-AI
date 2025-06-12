document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  const list = document.getElementById('commands');
  const data = await fetchJSON('/command-status');
  if (data) {
    Object.entries(data).forEach(([name, enabled]) => {
      const li = document.createElement('li');
      const label = document.createElement('label');
      label.textContent = name;
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = enabled;
      input.addEventListener('change', async () => {
        await fetch('/command-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: name, enabled: input.checked })
        });
      });
      label.prepend(input);
      li.appendChild(label);
      list.appendChild(li);
    });
  }
});
