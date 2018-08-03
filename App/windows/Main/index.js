const { BrowserWindow, globalShortcut } = require('electron');
const config = require('../../scripts/config.js');
const path = require('path');

const mainWindow = {
  hotkey: config.get('hotkeys.showApp'),
  win: null,
  initWindow: function() {
    mainWindow.win = new BrowserWindow({
      show: false,
      frame: false,
      maximizable: false,
      icon: path.join(__dirname, './Icon.png'),
      skipTaskbar: true
    });

    mainWindow.win.setBounds(config.get('winBounds'));
    mainWindow.win.setAlwaysOnTop(true, 'floating');
    mainWindow.win.setVisibleOnAllWorkspaces(true);
    mainWindow.win.setFullScreenable(false);

    mainWindow.win.loadURL(path.join(__dirname, './index.html'));
    if (process.env.NODE_ENV === 'dev') mainWindow.win.openDevTools();

    mainWindow.registerEvents();
  },
  registerEvents: function() {
    mainWindow.win.once('ready-to-show', mainWindow.win.show);
    mainWindow.win.on('close', () => {
      config.set('winBounds', mainWindow.win.getBounds());
    });
  },
  registerHotkey: function() {
    mainWindow.unregisterHotkey();
    mainWindow.hotkey = config.get('hotkeys.showApp');
    globalShortcut.register(config.get('hotkeys.showApp'), () => {
      if (mainWindow.win.isVisible()) {
        mainWindow.win.hide();
      } else {
        mainWindow.win.show();
      }
    });
  },
  unregisterHotkey: function() {
    globalShortcut.unregister(mainWindow.hotkey);
  },
  showOrHide: function() {
    if (mainWindow.win.isVisible()) mainWindow.win.hide();
    else mainWindow.win.show();
  }
};

module.exports = mainWindow;
