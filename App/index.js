const { app, ipcMain, session, Menu, Tray } = require('electron');
const config = require('./scripts/config.js');
const mainWindow = require('./windows/Main/index');
const settingWindow = require('./windows/Setting/index.js');
const liveTradeWindow = require('./windows/LiveTrade/index.js');
const path = require('path');
let tray = null;

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')({
  enabled: false
});

const windows = [mainWindow, liveTradeWindow, settingWindow];

function onClosed() {
  for (const window of windows) {
    window.win = null;
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow.win) {
    mainWindow.initWindow();
  }
  if (!liveTradeWindow.win) {
    liveTradeWindow.initWindow();
  }
});

app.on('ready', () => {
  mainWindow.initWindow();
  mainWindow.registerHotkey();
  liveTradeWindow.initWindow(mainWindow.win);

  tray = new Tray(path.join(__dirname, './Icon256.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      click: function() {
        mainWindow.showOrHide();
      }
    },
    {
      label: 'Close',
      click: function() {
        mainWindow.win.close();
      }
    }
  ]);

  tray.setToolTip('Path of Exile Trade Overlay');
  tray.setContextMenu(contextMenu);

  mainWindow.win.on('close', () => {
    if (settingWindow.win) settingWindow.win.close();
    if (liveTradeWindow.win) liveTradeWindow.win.close();
  });
  mainWindow.win.on('closed', onClosed);
  // No Ads in Dev Mode
  // only works for poe.trade right now
  if (process.env.NODE_ENV === 'dev' || process.env.adBlock === 'true') {
    const filter = {
      urls: ['*://*.cloudfront.net/*.gz.js']
    };
    session.defaultSession.webRequest.onBeforeRequest(filter, (e, a) => {
      console.log(e.url);
      a({
        cancel: true
      });
    });
  }
});

ipcMain.on('config-change', () => {
  mainWindow.registerHotkey();
  liveTradeWindow.registerHotkeys();
});

ipcMain.on('livesearch-item', (e, site, arg) => {
  if (!liveTradeWindow.win.isVisible()) liveTradeWindow.win.show();
  liveTradeWindow.win.webContents.send('livesearch-item', site, arg);
});

ipcMain.on('open-settings', () => {
  settingWindow.openSettings(mainWindow.win);
});

ipcMain.on('resize', (e, height, width) => {
  try {
    const electronScreen = require('electron').screen;
    const screenSize = electronScreen.getDisplayNearestPoint(electronScreen.getCursorScreenPoint()).bounds;

    // this function crashes if a float is givens
    const windowWidth = Math.floor(width);
    const windowHeight = Math.floor(height);
    liveTradeWindow.win.setSize(windowWidth, windowHeight);
    switch (config.get('liveSearch.corner')) {
      case 'topRight':
        liveTradeWindow.win.setPosition(Math.floor(screenSize.x + (screenSize.width - windowWidth)), screenSize.y);
        break;
      case 'bottomLeft':
        liveTradeWindow.win.setPosition(screenSize.x, Math.floor(screenSize.height - (windowHeight - screenSize.y)));
        break;
      case 'bottomRight':
        liveTradeWindow.win.setPosition(
          Math.floor(screenSize.x + (screenSize.width - windowWidth)),
          Math.floor(screenSize.height - (windowHeight - screenSize.y))
        );
        break;
      case 'topLeft':
      default:
        liveTradeWindow.win.setPosition(screenSize.x, screenSize.y);
        break;
    }
  } catch (error) {
    console.log(error);
    console.log('w: ' + width);
    console.log('h: ' + height);
  }
});
