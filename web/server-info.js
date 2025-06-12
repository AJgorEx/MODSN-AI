document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  const params = new URLSearchParams(window.location.search);
  const guildId = params.get('guildId');
  if (!guildId) {
    window.location.replace('servers.html');
    return;
  }
  const infoDiv = document.getElementById('info');
  const header = document.getElementById('server-name');
  try {
    const data = await fetchJSON(`/server-info/${guildId}`);
    if (header) header.textContent = `Server Info - ${data.name}`;
    if (infoDiv) {
      const created = new Date(data.createdAt).toLocaleString();
      infoDiv.innerHTML = `
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Owner ID:</strong> ${data.ownerId}</p>
        <p><strong>Members:</strong> ${data.memberCount}</p>
        <p><strong>Created:</strong> ${created}</p>
        ${data.description ? `<p>${data.description}</p>` : ''}
        ${data.icon ? `<img src="${data.icon}" alt="icon" style="width:128px;height:128px;">` : ''}
      `;
    }
  } catch (err) {
    notify('error', err.message);
  }
});
