const { BrowserWindow } = require('electron');

const path = require('path');

let settingWindow = {
  win: null,
  initWindow: function(parentWindow) {
    settingWindow.win = new BrowserWindow({
      show: true,
      frame: false,
      parent: parentWindow,
      height: 430,
      width: 350,
      skipTaskbar: true
    });

    settingWindow.win.setAlwaysOnTop(true, 'floating');
    settingWindow.win.setVisibleOnAllWorkspaces(true);
    settingWindow.win.setFullScreenable(false);
    settingWindow.win.setMenu(null);
    settingWindow.win.loadURL(path.join(__dirname, 'index.html'));

    if (process.env.NODE_ENV === 'dev') settingWindow.win.openDevTools();

    settingWindow.registerEvents();
  },
  openSettings: function(parentWindow) {
    if (settingWindow.win === null) {
      settingWindow.initWindow(parentWindow);
    } else {
      settingWindow.win.show();
    }
  },
  registerEvents: function() {
    settingWindow.win.on('close', () => {
      settingWindow.win = null;
    });
  }
};

module.exports = settingWindow;
