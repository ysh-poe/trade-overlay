const {
  app,
  globalShortcut,
  BrowserWindow,
  ipcMain
} = require('electron')

var path = require('path')
const {
  session
} = require('electron')

const config = require('./scripts/config.js')
// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')({
  enabled: true
})

// Prevent window being garbage collected
let mainWindow
let liveTradeWindow

var hotkeyShowApp = config.get('hotkeys.showApp')

var liveTradeHotkeys = {
  sendMessage: config.get('hotkeys.sendMessage'),
  nextItem: config.get('hotkeys.nextItem'),
  hideLiveSearch: config.get('hotkeys.hideLiveSearch')
}

function onClosed () {
  mainWindow = null
  liveTradeWindow = null
}

function createMainWindow () {
  let opts = {
    show: false,
    frame: false,
    maximizable: false
  }

  var win = new BrowserWindow(opts)

  win.setBounds(config.get('winBounds'))
  win.setAlwaysOnTop(true, 'floating')
  win.setVisibleOnAllWorkspaces(true)
  win.setFullScreenable(false)
  win.setMenu(null)
  win.once('ready-to-show', win.show)

  win.loadURL(path.join(__dirname, '../App/index.html'))
  if (process.env.NODE_ENV === 'dev') win.openDevTools()

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
    frame: false,
    parent: mainWindow
  }

  var win = new BrowserWindow(opts)

  win.setBounds(config.get('winLiveTradeBounds'))
  win.setAlwaysOnTop(true, 'floating')
  win.setVisibleOnAllWorkspaces(true)
  win.setFullScreenable(false)
  win.setMenu(null)

  win.loadURL(path.join(__dirname, '../LiveTrade/index.html'))
  if (process.env.NODE_ENV === 'dev') win.openDevTools()

  win.on('close', () => {
    config.set('winLiveTradeBounds', liveTradeWindow.getBounds())
    if (mainWindow !== null) return false
  })

  win.on('show', registerLiveTradeHotkeys)
  win.on('hide', () => unregisterLiveTradeHotkeys(false))

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

function registerShowAppHotkeys () {
  hotkeyShowApp = config.get('hotkeys.showApp')
  globalShortcut.register(config.get('hotkeys.showApp'), () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
}

function registerLiveTradeHotkeys () {
  unregisterLiveTradeHotkeys(true)
  liveTradeHotkeys = {
    sendMessage: config.get('hotkeys.sendMessage'),
    nextItem: config.get('hotkeys.nextItem'),
    hideLiveSearch: config.get('hotkeys.hideLiveSearch')
  }
  globalShortcut.register(liveTradeHotkeys.sendMessage, () => liveTradeWindow.webContents.send('send-message'))
  globalShortcut.register(liveTradeHotkeys.nextItem, () => liveTradeWindow.webContents.send('next-item'))
  globalShortcut.register(liveTradeHotkeys.hideLiveSearch, () => {
    if (liveTradeWindow.isVisible()) {
      liveTradeWindow.hide()
    } else {
      liveTradeWindow.show()
    }
  })
}

function unregisterLiveTradeHotkeys (all = false) {
  globalShortcut.unregister(liveTradeHotkeys.sendMessage)
  globalShortcut.unregister(liveTradeHotkeys.nextItem)
  if (all) globalShortcut.unregister(liveTradeHotkeys.hideLiveSearch)
}

app.on('ready', () => {
  mainWindow = createMainWindow()
  liveTradeWindow = createLiveTradeWindow()

  // No Ads in Dev Mode
  // only works for poe.trade right now
  if (process.env.NODE_ENV === 'dev') {
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

  registerShowAppHotkeys()
})

ipcMain.on('config-change', () => {
  globalShortcut.unregister(hotkeyShowApp)
  registerShowAppHotkeys()
  registerLiveTradeHotkeys()
})

ipcMain.on('livesearch-item', (e, site, arg) => {
  liveTradeWindow.show()
  liveTradeWindow.webContents.send('livesearch-item', site, arg)
})

ipcMain.on('resize', (e, height, width) => {
  try {
    // this function crashes if a float is given
    // truncate it into an integer using binary operations
    liveTradeWindow.setSize((width + 50 | 0), (height + 10 | 0))
  } catch (error) {
    console.log(error)
    console.log('w: ' + width)
    console.log('h: ' + height)
  }
})
