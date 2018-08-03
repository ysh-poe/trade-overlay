const config = require('../../../scripts/config.js');
const { remote } = require('electron');
const browserWindow = remote.getCurrentWindow();
const { ipcRenderer } = require('electron');

const settingForm = {
  populateForm: function() {
    const hotkeys = document.querySelectorAll('.hotkeys input[type=text]');

    hotkeys.forEach(input => {
      input.value = config.get(input.id);
    });

    const liveTrade = document.querySelector('.liveTrade');
    for (const option of liveTrade.querySelector('#corner').children) {
      if (option.value === config.get('liveSearch.corner')) {
        option.selected = true;
        break;
      }
    }

    for (const option of liveTrade.querySelector('#template').children) {
      if (option.value === config.get('liveSearch.template')) {
        option.selected = true;
        break;
      }
    }

    const smallSockets = liveTrade.querySelector('input[type=checkbox]');
    console.log(config.get('liveSearch.smallSockets'));
    if (config.get('liveSearch.smallSockets') === true) smallSockets.checked = true;
  },
  saveSettings: function() {
    const hotkeys = document.querySelectorAll('input');

    hotkeys.forEach(input => {
      config.set(input.id, input.value);
    });

    const liveTrade = document.querySelector('.liveTrade');
    config.set('liveSearch.corner', liveTrade.querySelector('#corner option:checked').value);
    config.set('liveSearch.template', liveTrade.querySelector('#template option:checked').value);

    const smallSockets = liveTrade.querySelector('input[type=checkbox]');
    config.set('liveSearch.smallSockets', smallSockets.checked);

    ipcRenderer.send('config-change');
    browserWindow.close();
  }
};

module.exports = settingForm;
