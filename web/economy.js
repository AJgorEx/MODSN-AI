document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  await refreshEconomy();

  const amountInput = document.getElementById('amount');
  document.getElementById('depositBtn')?.addEventListener('click', async () => {
    const amt = parseInt(amountInput.value, 10);
    if (amt > 0) {
      await fetch('/economy/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt })
      });
      await refreshEconomy();
    }
  });

  document.getElementById('withdrawBtn')?.addEventListener('click', async () => {
    const amt = parseInt(amountInput.value, 10);
    if (amt > 0) {
      await fetch('/economy/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt })
      });
      await refreshEconomy();
    }
  });

  document.getElementById('dailyBtn')?.addEventListener('click', async () => {
    const res = await fetch('/economy/daily', { method: 'POST' });
    if (res.ok) {
      alert('Daily claimed!');
      await refreshEconomy();
    } else {
      const text = await res.text();
      alert(text);
    }
  });

  document.getElementById('workBtn')?.addEventListener('click', async () => {
    const res = await fetch('/economy/work', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      alert(`You earned ${data.reward} coins`);
      await refreshEconomy();
    } else {
      const text = await res.text();
      alert(text);
    }
  });
});

async function refreshEconomy() {
  try {
    const data = await fetchJSON('/economy');
    document.getElementById('wallet').textContent = data.balance;
    document.getElementById('bank').textContent = data.bank;
  } catch (_) {}
}
