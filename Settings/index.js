const { remote } = require('electron')
const BrowserWindow = remote.BrowserWindow

var path = require('path')

let settingWindow = null

function openSettings () {
  if (settingWindow == null) {
    settingWindow = createSettingWindow()
  } else {
    settingWindow.show()
  }
}

function createSettingWindow () {
  let opts = {
    show: true,
    frame: false,
    parent: remote.getCurrentWindow()
  }

  var win = new BrowserWindow(opts)

  win.setAlwaysOnTop(true, 'floating')
  win.setVisibleOnAllWorkspaces(true)
  win.setFullScreenable(false)
  win.setMenu(null)
  win.loadURL(path.join(__dirname, 'index.html'))

  if (process.env.NODE_ENV === 'dev') win.openDevTools()

  win.on('close', () => {
    settingWindow = null
  })

  return win
}

module.exports = openSettings
