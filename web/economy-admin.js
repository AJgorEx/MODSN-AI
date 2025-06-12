document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  const params = new URLSearchParams(window.location.search);
  const guildId = params.get('guildId');
  if (!guildId) {
    window.location.replace('servers.html');
    return;
  }
  const memberSelect = document.getElementById('member');
  const walletInput = document.getElementById('wallet');
  const bankInput = document.getElementById('bank');
  const amountInput = document.getElementById('amount');
  const header = document.getElementById('server-name');
  try {
    const guilds = await fetchJSON('/guilds');
    const guild = guilds.find(g => g.id === guildId);
    if (guild && header) header.textContent = `Economy Manager - ${guild.name}`;
  } catch (_) {}
  const members = await fetchJSON(`/members/${guildId}`);
  if (members)
    members.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.username;
      memberSelect.appendChild(opt);
    });
  async function loadEconomy() {
    const id = memberSelect.value;
    if (!id) return;
    try {
      const data = await fetchJSON(`/economy/user/${guildId}/${id}`);
      walletInput.value = data.balance;
      bankInput.value = data.bank;
    } catch (err) {
      notify('error', err.message);
    }
  }
  memberSelect.addEventListener('change', loadEconomy);
  await loadEconomy();
  document.querySelectorAll('#economyForm button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const body = { action: btn.dataset.action, amount: parseInt(amountInput.value, 10) };
      try {
        const data = await fetchJSON(`/economy/user/${guildId}/${memberSelect.value}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        walletInput.value = data.balance;
        bankInput.value = data.bank;
        notify('success', 'Updated');
      } catch (err) {
        notify('error', err.message);
      }
    });
  });
});
