let allMembers = [];
let page = 0;
const pageSize = 20;

function renderMembers() {
  const list = document.getElementById('members');
  const search = document.getElementById('search');
  const sort = document.getElementById('sort');
  const pageInfo = document.getElementById('pageInfo');
  if (!list) return;
  list.innerHTML = '';
  const term = search?.value.toLowerCase() || '';
  const sorted = [...allMembers].sort((a, b) => {
    return sort?.value === 'desc'
      ? b.username.localeCompare(a.username)
      : a.username.localeCompare(b.username);
  });
  const filtered = sorted.filter(m => m.username.toLowerCase().includes(term));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  page = Math.min(page, pages - 1);
  const slice = filtered.slice(page * pageSize, page * pageSize + pageSize);
  slice.forEach(m => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.gap = '0.5rem';
    const img = document.createElement('img');
    img.className = 'avatar';
    img.style.width = '32px';
    img.style.height = '32px';
    img.src = m.avatar;
    const span = document.createElement('span');
    span.textContent = m.username;
    const idBtn = document.createElement('button');
    idBtn.className = 'btn btn-sm';
    idBtn.textContent = 'Copy ID';
    idBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(m.id);
      notify('success', 'Copied');
    });
    const dmBtn = document.createElement('button');
    dmBtn.className = 'btn btn-sm';
    dmBtn.textContent = 'DM';
    dmBtn.addEventListener('click', async () => {
      const msg = prompt('Enter message to send via bot');
      if (!msg) return;
      try {
        await fetchJSON(`/dm/${m.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        });
        notify('success', 'DM sent');
      } catch (err) {
        notify('error', err.message);
      }
    });
    li.appendChild(img);
    li.appendChild(span);
    li.appendChild(idBtn);
    li.appendChild(dmBtn);
    list.appendChild(li);
  });
  if (pageInfo) pageInfo.textContent = `${page + 1}/${pages}`;
}

function exportCSV() {
  const rows = [['ID', 'Username']].concat(
    allMembers.map(m => [m.id, m.username])
  );
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'members.csv';
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  const params = new URLSearchParams(window.location.search);
  const guildId = params.get('guildId');
  if (!guildId) {
    window.location.replace('servers.html');
    return;
  }
  const header = document.getElementById('server-name');
  try {
    const guilds = await fetchJSON('/guilds');
    const guild = guilds.find(g => g.id === guildId);
    if (guild && header) header.textContent = `Members - ${guild.name}`;
  } catch (_) {}
  const members = await fetchJSON(`/members/${guildId}`);
  allMembers = Array.isArray(members) ? members : [];
  renderMembers();
  document.getElementById('search')?.addEventListener('input', () => {
    page = 0;
    renderMembers();
  });
  document.getElementById('sort')?.addEventListener('change', () => {
    renderMembers();
  });
  document.getElementById('prevPage')?.addEventListener('click', () => {
    if (page > 0) {
      page--;
      renderMembers();
    }
  });
  document.getElementById('nextPage')?.addEventListener('click', () => {
    const pages = Math.ceil(allMembers.length / pageSize);
    if (page < pages - 1) {
      page++;
      renderMembers();
    }
  });
  document.getElementById('exportBtn')?.addEventListener('click', exportCSV);
});
