const { BrowserWindow, globalShortcut } = require('electron')
const config = require('../Main/scripts/config.js')
var path = require('path')

var mainWindow = {
  hotkey: config.get('hotkeys.showApp'),
  win: null,
  initWindow: function () {
    let opts = {
      show: false,
      frame: false,
      maximizable: false
    }

    this.win = new BrowserWindow(opts)

    this.win.setBounds(config.get('winBounds'))
    this.win.setAlwaysOnTop(true, 'floating')
    this.win.setVisibleOnAllWorkspaces(true)
    this.win.setFullScreenable(false)
    this.win.setMenu(null)

    this.win.loadURL(path.join(__dirname, '../App/index.html'))
    if (process.env.NODE_ENV === 'dev') this.win.openDevTools()

    this.registerEvents()
  },
  registerEvents: function () {
    this.win.once('ready-to-show', this.win.show)
    this.win.on('close', () => {
      config.set('winBounds', this.win.getBounds())
    })
  },
  registerHotkey: function () {
    this.unregisterHotkey()
    this.hotkey = config.get('hotkeys.showApp')
    globalShortcut.register(config.get('hotkeys.showApp'), () => {
      if (this.win.isVisible()) {
        this.win.hide()
      } else {
        this.win.show()
      }
    })
  },
  unregisterHotkey: function () {
    globalShortcut.unregister(this.hotkey)
  }
}

module.exports = mainWindow
