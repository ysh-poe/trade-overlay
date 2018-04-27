const { app, ipcMain, session } = require('electron')
const config = require('./scripts/config.js')
var mainWindow = require('../App/index.js')
var settingWindow = require('../Settings/index.js')
var liveTradeWindow = require('../LiveTrade/index.js')

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')({
  enabled: true
})

// Prevent window being garbage collected
var windows = [mainWindow, liveTradeWindow, settingWindow]

function onClosed () {
  for (const window of windows) {
    window.win = null
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow.win) {
    mainWindow.initWindow()
  }
  if (!liveTradeWindow.win) {
    liveTradeWindow.initWindow()
  }
})

app.on('ready', () => {
  mainWindow.initWindow()
  mainWindow.registerHotkey()
  liveTradeWindow.initWindow(mainWindow.win)

  mainWindow.win.on('will-navigate', () => console.log('ASDASDAS'))

  mainWindow.win.on('close', () => {
    if (settingWindow.win) settingWindow.win.close()
    if (liveTradeWindow.win) liveTradeWindow.win.close()
  })
  mainWindow.win.on('closed', onClosed)
  // No Ads in Dev Mode
  // only works for poe.trade right now
  if (process.env.NODE_ENV === 'dev' || process.env.adBlock === 'true') {
    const filter = {
      urls: ['*://*.cloudfront.net/*.gz.js']
    }
    session.defaultSession.webRequest.onBeforeRequest(filter, (e, a) => {
      console.log(e.url)
      a({
        cancel: true
      })
    })
  }
})

ipcMain.on('config-change', () => {
  mainWindow.registerHotkey()
  liveTradeWindow.registerHotkeys()
})

ipcMain.on('livesearch-item', (e, site, arg) => {
  if (!liveTradeWindow.win.isVisible()) liveTradeWindow.win.show()
  liveTradeWindow.win.webContents.send('livesearch-item', site, arg)
})

ipcMain.on('open-settings', () => {
  settingWindow.openSettings(mainWindow.win)
})

ipcMain.on('resize', (e, height, width) => {
  try {
    var electronScreen = require('electron').screen
    var screenSize = electronScreen.getDisplayNearestPoint(electronScreen.getCursorScreenPoint()).bounds

    // this function crashes if a float is given
    // truncate it into an integer using binary operations
    var windowWidth = (width + 50 | 0)
    var windowHeight = (height + 10 | 0)
    liveTradeWindow.win.setSize(windowWidth, windowHeight)
    switch (config.get('liveSearch.corner')) {
      case 'topRight':
        liveTradeWindow.win.setPosition(Math.floor(screenSize.x + (screenSize.width - windowWidth)), screenSize.y)
        break
      case 'bottomLeft':
        liveTradeWindow.win.setPosition(screenSize.x, Math.floor(screenSize.height - (windowHeight - screenSize.y)))
        break
      case 'bottomRight':
        liveTradeWindow.win.setPosition(
          Math.floor(screenSize.x + (screenSize.width - windowWidth)),
          Math.floor(screenSize.height - (windowHeight - screenSize.y)))
        break
      case 'topLeft':
      default:
        liveTradeWindow.win.setPosition(screenSize.x, screenSize.y)
        break
    }
  } catch (error) {
    console.log(error)
    console.log('w: ' + width)
    console.log('h: ' + height)
  }
})
