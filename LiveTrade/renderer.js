const { remote, ipcRenderer } = require('electron')
const currentWindow = remote.getCurrentWindow()
var $ = require('jquery')
var clipboardy = require('clipboardy')

var template = require('./scripts/template.js')
var Parser = require('./parsers/parser.js')
var sendMessage = require('../App/webview/scripts/windows.js')

window.itemQueue = []
window.hasItem = false

ipcRenderer.on('livesearch-item', (e, site, arg) => {
  var data
  if (site === 'poetrade') {
    data = Parser.parsePoETrade(arg.data)
  } else {
    data = Parser.parsePoE(arg)
  }

  window.itemQueue = window.itemQueue.concat(data)
  if (!window.hasItem) {
    window.hasItem = true
    next()
  }
  updateAmount()
})

$('.close').on('click', () => {
  currentWindow.hide()
})

$('.next').on('click', next)

$(document).on('click', 'a.whisper', (e) => {
  liveTradeMessage(e)
  next()
})

$(document).on('click', 'a.whisper-btn', () => {
  liveTradeMessage($('a.whisper'))
})

// If window gets closed, instead just hide it
window.onbeforeunload = function (e) {
  var parent = currentWindow.getParentWindow()

  if (parent !== null) {
    currentWindow.hide()
    e.returnValue = false
  }
}

function next () {
  $('.content').html(template.createItemTemplate(window.itemQueue.shift()))
  updateAmount()
}

function updateAmount () {
  $('#amount').html(window.itemQueue.length)
}

function liveTradeMessage (e) {
  clipboardy.writeSync(e.currentTarget.dataset.message)
  sendMessage()
}
