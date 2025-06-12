const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'data/economy-config.json');
let data = {
  dailyReward: 100,
  workMin: 50,
  workMax: 100,
  gambleMultiplier: 2
};

try {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = JSON.parse(raw);
  data = { ...data, ...parsed };
} catch (_) {}

function save() {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  get() {
    return data;
  },
  set(values) {
    data = { ...data, ...values };
    save();
  }
};
