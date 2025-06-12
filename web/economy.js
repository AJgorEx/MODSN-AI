document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  await refreshEconomy();

  const amountInput = document.getElementById('amount');
  document.getElementById('depositBtn')?.addEventListener('click', async () => {
    const amt = parseInt(amountInput.value, 10);
    if (amt > 0) {
      try {
        await fetchJSON('/economy/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amt })
        });
        await refreshEconomy();
        notify('success', 'Deposited');
      } catch (e) {
        notify('error', e.message);
      }
    }
  });

  document.getElementById('withdrawBtn')?.addEventListener('click', async () => {
    const amt = parseInt(amountInput.value, 10);
    if (amt > 0) {
      try {
        await fetchJSON('/economy/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amt })
        });
        await refreshEconomy();
        notify('success', 'Withdrawn');
      } catch (e) {
        notify('error', e.message);
      }
    }
  });

  document.getElementById('dailyBtn')?.addEventListener('click', async () => {
    const res = await fetch('/economy/daily', { method: 'POST' });
    if (res.ok) {
      notify('success', 'Daily claimed!');
      await refreshEconomy();
    } else {
      const text = await res.text();
      notify('error', text);
    }
  });

  document.getElementById('workBtn')?.addEventListener('click', async () => {
    const res = await fetch('/economy/work', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      notify('success', `You earned ${data.reward} coins`);
      await refreshEconomy();
    } else {
      const text = await res.text();
      notify('error', text);
    }
  });

  document.getElementById('gambleBtn')?.addEventListener('click', async () => {
    const amt = parseInt(amountInput.value, 10);
    if (amt > 0) {
      const res = await fetch('/economy/gamble', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reward > 0) {
          notify('success', 'You won!');
        } else {
          notify('info', 'You lost.');
        }
        await refreshEconomy();
      } else {
        const text = await res.text();
        notify('error', text);
      }
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
