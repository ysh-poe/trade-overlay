/* global JSONEditor */
var { remote } = require('electron')
var browserWindow = remote.getCurrentWindow()
var path = require('path')
var fs = require('fs')
var TitleBar = require('electron-titlebar-windows')
var { ipcRenderer } = require('electron')

var $ = require('jquery')

// This writes JSONEditor into the global scope.
require(path.join(__dirname, '../node_modules/json-editor/dist/jsoneditor.min.js'))

const config = require('../Main/scripts/config.js')
const titleBar = new TitleBar({
  darkMode: false,
  color: 'rgb(220, 200, 200)',
  backgroundColor: 'rgb(32, 35, 64)',
  draggable: true,
  fullscreen: false
})

titleBar.appendTo($('.title-bar')[0])
// Registering the Events for the title bar buttons
titleBar.on('close', () => {
  browserWindow.close()
})

titleBar.on('fullscreen', () => {
  titleBar.Bounds = browserWindow.getBounds()
  browserWindow.setFullScreen(true)
  browserWindow.maximize()
})

titleBar.on('maximize', (e) => {
  browserWindow.setBounds(titleBar.Bounds)
  browserWindow.setFullScreen(false)
})
// Initialize the editor
var editor = new JSONEditor($('.editor')[0], {
  schema: JSON.parse(fs.readFileSync(path.join(__dirname, '../Main/config/schema.json'), 'utf8')),
  disable_array_reorder: true,
  disable_collapse: true,
  disable_edit_json: true,
  disable_properties: true,
  required_by_default: true,
  startval: {
    hotkeys: config.get('hotkeys'),
    liveSearch: config.get('liveSearch')
    // tabs: config.get('tabs')
  }
})

$('input.save').on('submit click', () => {
  config.set(editor.getValue())
  ipcRenderer.send('config-change')
  browserWindow.close()
})

$('.titlebar-minimize').remove()
