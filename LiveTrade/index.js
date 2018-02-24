const { BrowserWindow, globalShortcut } = require('electron')
const config = require('../Main/scripts/config.js')
var path = require('path')

var window = {
  hotkeys: {
    sendMessage: config.get('hotkeys.sendMessage'),
    nextItem: config.get('hotkeys.nextItem'),
    hideLiveSearch: config.get('hotkeys.hideLiveSearch')
  },
  win: null,
  initWindow: function (mainWindow) {
    let opts = {
      show: false,
      frame: false,
      parent: mainWindow
    }

    this.win = new BrowserWindow(opts)

    this.win.setBounds(config.get('winLiveTradeBounds'))
    this.win.setAlwaysOnTop(true, 'floating')
    this.win.setVisibleOnAllWorkspaces(true)
    this.win.setFullScreenable(false)
    this.win.setMenu(null)

    this.win.loadURL(path.join(__dirname, '../LiveTrade/index.html'))
    if (process.env.NODE_ENV === 'dev') this.win.openDevTools()
    this.registerEvents()
  },
  registerHotkeys: function () {
    window.unregisterHotkeys(true)
    window.hotkeys = {
      sendMessage: config.get('hotkeys.sendMessage'),
      nextItem: config.get('hotkeys.nextItem'),
      hideLiveSearch: config.get('hotkeys.hideLiveSearch')
    }
    globalShortcut.register(window.hotkeys.sendMessage, () => window.win.webContents.send('send-message'))
    globalShortcut.register(window.hotkeys.nextItem, () => window.win.webContents.send('next-item'))
    globalShortcut.register(window.hotkeys.hideLiveSearch, () => {
      if (window.win.isVisible()) {
        window.win.hide()
      } else {
        window.win.show()
      }
    })
  },
  unregisterHotkeys: function (all = false) {
    globalShortcut.unregister(this.hotkeys.sendMessage)
    globalShortcut.unregister(this.hotkeys.nextItem)
    if (all) globalShortcut.unregister(this.hotkeys.hideLiveSearch)
  },
  registerEvents: function () {
    this.win.on('show', this.registerHotkeys)
    this.win.on('hide', () => this.unregisterHotkeys(false))
    this.win.on('close', () => {
      config.set('winLiveTradeBounds', this.win.getBounds())
      if (this.win.getParentWindow() !== null) return false
    })
  }
}
module.exports = window
