document.addEventListener('DOMContentLoaded', async () => {
  await loadUserInfo();
  const dailyInput = document.getElementById('dailyReward');
  const workMinInput = document.getElementById('workMin');
  const workMaxInput = document.getElementById('workMax');
  const gambleInput = document.getElementById('gambleMultiplier');
  const saveBtn = document.getElementById('saveEconomyCfg');
  try {
    const data = await fetchJSON('/economy-config');
    if (data) {
      dailyInput.value = data.dailyReward;
      workMinInput.value = data.workMin;
      workMaxInput.value = data.workMax;
      gambleInput.value = data.gambleMultiplier;
    }
  } catch (_) {}
  saveBtn.addEventListener('click', async () => {
    const body = {
      dailyReward: parseInt(dailyInput.value, 10),
      workMin: parseInt(workMinInput.value, 10),
      workMax: parseInt(workMaxInput.value, 10),
      gambleMultiplier: parseFloat(gambleInput.value)
    };
    try {
      const res = await fetch('/economy-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const text = await res.text();
      if (res.ok) notify('success', text); else notify('error', text);
    } catch (err) {
      notify('error', err.message);
    }
  });
});
