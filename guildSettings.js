const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'data/guild-settings.json');
let data = {};
try {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (_) {
  data = {};
}

function save() {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  get(id) {
    return data[id] || {};
  },
  set(id, values) {
    data[id] = { ...(data[id] || {}), ...values };
    save();
  },
  all() {
    return data;
  }
};
