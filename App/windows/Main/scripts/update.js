const version = require('../../../../package.json').version;
const axios = require('axios');

function requireUpdate(callback) {
  axios.get('https://api.github.com/repos/ysh-poe/trade-overlay/releases').then(response => {
    if (version_compare(version, response.data[0].tag_name) === -1) {
      callback(response.data[0].html_url);
    }
  });
}

function version_compare(a, b) {
  const pa = a.split('.');
  const pb = b.split('.');
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }
  return 0;
}

module.exports = requireUpdate;
