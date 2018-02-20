'use strict'
const { app, globalShortcut, BrowserWindow, ipcMain } = require('electron')

var path = require('path')

const config = require('./App/webview/scripts/config.js')
// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// Prevent window being garbage collected
let mainWindow
let liveTradeWindow

function onClosed () {
  // Dereference the window
  // For multiple windows store them in an array
  mainWindow = null
  liveTradeWindow = null
}

function createMainWindow () {
  let opts = {
    show: false,
    frame: false }

  var win = new BrowserWindow(opts)

  win.setBounds(config.get('winBounds'))
  win.setAlwaysOnTop(true, 'floating')
  win.setVisibleOnAllWorkspaces(true)
  // win.setFullScreenable(false)
  win.setMenu(null)
  win.once('ready-to-show', win.show)

  win.loadURL(path.join(__dirname, 'App/webview/index.html'))
  // win.openDevTools()
  win.on('closed', onClosed)
  win.on('close', () => {
    config.set('winBounds', mainWindow.getBounds())
    liveTradeWindow.close()
  })

  return win
}

function createLiveTradeWindow () {
  let opts = {
    show: false,
    frame: true,
    parent: mainWindow
  }

  var win = new BrowserWindow(opts)

  win.setBounds(config.get('winLiveTradeBounds'))
  // win.setAlwaysOnTop(true, 'floating')
  // win.setVisibleOnAllWorkspaces(true)
  win.setFullScreenable(false)
  win.setMenu(null)
  win.once('ready-to-show', win.show)

  win.loadURL(path.join(__dirname, 'LiveTrade/index.html'))
  win.openDevTools()

  win.on('close', () => {
    config.set('winLiveTradeBounds', mainWindow.getBounds())
    if (mainWindow !== null) return false
  })

  return win
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow()
  }
  if (!liveTradeWindow) {
    liveTradeWindow = createLiveTradeWindow()
  }
})

app.on('ready', () => {
  mainWindow = createMainWindow()
  liveTradeWindow = createLiveTradeWindow()
  liveTradeWindow.show()
  globalShortcut.register('F6', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
})

ipcMain.on('livesearch-item', (e, site, arg) => {
  if ((site === 'poetrade' && typeof arg.count === 'undefined') || (site === 'PathOfExileTrade' && (arg === null || typeof arg.result === 'undefined' || typeof arg.result[0].item === 'undefined'))) {
    return
  }
  liveTradeWindow.show()
  liveTradeWindow.webContents.send('livesearch-item', site, arg)
  console.log('itemFound')
})
