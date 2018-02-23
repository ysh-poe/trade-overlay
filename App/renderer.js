var $ = require('jquery')
var { remote } = require('electron')
var browserWindow = remote.getCurrentWindow()

const config = require('../Main/scripts/config.js')
var tradeTabs = require('./scripts/tradeTabs.js')
var TitleBar = require('./scripts/titleBar.js')
var openSettings = require('../Settings/index.js')

var tabList = config.loadTabGroup()

const titleBar = new TitleBar({
  darkMode: false,
  color: 'rgb(220, 200, 200)',
  backgroundColor: 'rgb(32, 35, 64)',
  draggable: true,
  fullscreen: false
})

titleBar.appendTo($('.title-bar')[0])
titleBar.addLink('http://poe.trade', 'Poe.trade')
titleBar.addLink('http://poeapp.com', 'Poeapp.com')
titleBar.addLink('http://pathofexile.com/trade', 'Pathofexile/trade')
titleBar.Bounds = browserWindow.getBounds()

// Registering the Events for the title bar buttons
titleBar.on('close', () => {
  browserWindow.close()
})

titleBar.on('fullscreen', () => {
  titleBar.Bounds = browserWindow.getBounds()
  browserWindow.setFullScreen(true)
  browserWindow.maximize()
  console.log('full')
})

titleBar.on('minimize', () => {
  browserWindow.hide()
})

titleBar.on('maximize', (e) => {
  browserWindow.setBounds(titleBar.Bounds)
  browserWindow.setFullScreen(false)
  console.log('max')
})

if (tabList !== null && tabList.length > 0) {
  tradeTabs.loadTabList(tabList)
} else {
  tradeTabs.addTab()
}

$('.add-tab').on('click', (e) => tradeTabs.addTradeTab(e.currentTarget.innerText, e.currentTarget.dataset.url))

$(document).on('click', '.title-bar-arrow', (e) => {
  if (config.get('collapsed') === true) {
    config.set('collapsed', false)
    e.currentTarget.className = 'title-bar-arrow down'
    $('.etabs-tabgroup').slideDown()
  } else {
    config.set('collapsed', true)
    e.currentTarget.className = 'title-bar-arrow right'
    $('.etabs-tabgroup').slideUp()
  }
})

if (config.get('collapsed') === true) {
  $('.title-bar-arrow').attr('class', 'title-bar-arrow right')
  $('.etabs-tabgroup').slideUp()
} else {
  $('.title-bar-arrow').attr('class', 'title-bar-arrow down')
  $('.etabs-tabgroup').slideDown()
}

// cogWheel got clicked
$(document).on('click', '.titlebar-controls .material-icons', (e) => {
  openSettings()
})

console.log(tradeTabs)

// Store the tabs on close
window.onbeforeunload = () => config.storeTabGroup(tradeTabs)
