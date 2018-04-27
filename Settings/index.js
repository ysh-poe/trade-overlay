const { BrowserWindow } = require('electron')

var path = require('path')

let settingWindow = {
  win: null,
  initWindow: function (parentWindow) {
    let opts = {
      show: true,
      frame: false,
      parent: parentWindow
    }

    this.win = new BrowserWindow(opts)

    this.win.setAlwaysOnTop(true, 'floating')
    this.win.setVisibleOnAllWorkspaces(true)
    this.win.setFullScreenable(false)
    this.win.setMenu(null)
    this.win.loadURL(path.join(__dirname, 'index.html'))

    if (process.env.NODE_ENV === 'dev') this.win.openDevTools()

    this.registerEvents()
  },
  openSettings: function (parentWindow) {
    if (this.win === null) {
      this.initWindow(parentWindow)
    } else {
      this.win.show()
    }
  },
  registerEvents: function () {
    this.win.on('close', () => {
      this.win = null
    })
  }
}

module.exports = settingWindow
