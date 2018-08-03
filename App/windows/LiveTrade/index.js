const { BrowserWindow, globalShortcut } = require('electron');
const config = require('../../scripts/config.js');
const path = require('path');

const window = {
  hotkeys: {
    sendMessage: config.get('hotkeys.sendMessage'),
    nextItem: config.get('hotkeys.nextItem'),
    hideLiveSearch: config.get('hotkeys.hideLive')
  },
  win: null,
  initWindow: function(mainWindow) {
    let opts = { show: false, frame: false, parent: mainWindow, skipTaskbar: true };

    window.win = new BrowserWindow(opts);
    window.win.setBounds(config.get('winLiveTradeBounds'));
    window.win.setAlwaysOnTop(true, 'floating');
    window.win.setVisibleOnAllWorkspaces(true);
    window.win.setFullScreenable(false);
    window.win.setMenu(null);

    window.win.loadURL(path.join(__dirname, '../LiveTrade/index.html'));
    if (process.env.NODE_ENV === 'dev') window.win.openDevTools();
    window.registerEvents();
  },
  registerHotkeys: function() {
    window.unregisterHotkeys(true);
    window.hotkeys = {
      sendMessage: config.get('hotkeys.sendMessage'),
      nextItem: config.get('hotkeys.nextItem'),
      hideLiveSearch: config.get('hotkeys.hideLive')
    };
    globalShortcut.register(window.hotkeys.sendMessage, () => window.win.webContents.send('send-message'));
    globalShortcut.register(window.hotkeys.nextItem, () => window.win.webContents.send('next-item'));
    globalShortcut.register(window.hotkeys.hideLiveSearch, () => {
      if (window.win.isVisible()) {
        window.win.hide();
      } else {
        window.win.show();
      }
    });
  },
  unregisterHotkeys: function(all = false) {
    if (window.hotkeys.sendMessage !== 'undefined') globalShortcut.unregister(window.hotkeys.sendMessage);
    if (window.hotkeys.nextItem !== 'undefined') globalShortcut.unregister(window.hotkeys.nextItem);
    if (all && window.hotkeys.hideLiveSearch !== 'undefined') globalShortcut.unregister(window.hotkeys.hideLiveSearch);
  },
  registerEvents: function() {
    window.win.on('show', window.registerHotkeys);
    window.win.on('hide', () => window.unregisterHotkeys(false));
    window.win.on('close', () => {
      config.set('winLiveTradeBounds', window.win.getBounds());
      if (window.win.getParentWindow() !== null) return false;
    });
  }
};
module.exports = window;
