var TabGroup = require('electron-tabs')
const { shell } = require('electron')
var $ = require('jquery')

var sendMessage = require('../../Main/scripts/windows.js')

class TradeTabs extends TabGroup {
  constructor () {
    super({
      newTab: {
        title: 'Poe Trade',
        src: 'http://poe.trade',
        visible: true,
        webviewAttributes: { preload: './scripts/preload.js' }
      }
    })
    this.initial = true
  }

  addTradeTab (title, url) {
    this.addTab({
      title: title,
      src: url,
      visible: true,
      webviewAttributes: { preload: './scripts/preload.js' }
    })
  }

  loadTabList (tabList) {
    var tab = tabList.shift()
    if (tab !== null && tab !== undefined) {
      if (tab.src !== undefined) {
        this.addTab({
          title: tab.title,
          src: tab.src,
          visible: true,
          webviewAttributes: {
            preload: './scripts/preload.js'
          },
          ready: () => this.loadTabList(tabList)
        })
      }
    }
  }

  editTab (tabEvent) {
    // select all tabs
    var tabs = tabEvent.currentTarget.parentElement.children

    // iterate over every tab to find the tab that is rightclicked
    for (var tempTab in tabs) {
      if (tabs[tempTab] === tabEvent.currentTarget) {
        var tab_ = tradeTabs.getTabByPosition(Number(tempTab) + 1)
        showEditForm(tab_, tempTab)
        break
      }
    }
  }
}

var tradeTabs = new TradeTabs()

tradeTabs.on('tab-active', (tab, tradeTabs) => {
  tab.setBadge(false)
  tab.flash(false)
})

tradeTabs.on('tab-added', (tab, tradeTabs) => {
  tab.activate()
  if (process.env.NODE_ENV === 'dev') tab.webview.addEventListener('dom-ready', () => tab.webview.openDevTools())

  // Event if whisper button is clicked
  tab.webview.addEventListener('ipc-message', event => {
    if (event.channel === 'whisper') {
      console.log('event.sendmessage')
      // For some reason it only sends the message on the second attempt,
      // so we just try to send the message twice on a new tab
      if (tradeTabs.initial) {
        setTimeout(sendMessage, 20)
        tradeTabs.initial = false
      }
      setTimeout(sendMessage, 10)
    } else if (event.channel === 'notify') {
      console.log(tab)
      if (tab.getBadge() === false || tab.getBadge() === null || tab.getBadge() === undefined) {
        tab.setBadge(1)
      } else {
        tab.setBadge(Number(tab.getBadge()) + 1)
      }
    }
  })

  // Reset Badge and flash if active
  tab.on('active', (tab) => {
    tab.setBadge(false)
    tab.flash(false)
  })

  tab.tab.addEventListener('auxclick', (e) => {
    if (e.button === 2) {
      tradeTabs.editTab(e)
    } else if (e.button === 1) {
      tab.close()
    }
  })

  // External link event
  tab.webview.addEventListener('new-window', (e) => {
    const protocol = require('url').parse(e.url).protocol
    if (protocol === 'http:' || protocol === 'https:') {
      shell.openExternal(e.url)
    }
  })
})

function showEditForm (tab, tabID) {
  $('#title').val(tab.getTitle())
  $('#url').val(tab.webview.src)
  $('#edit-id').val(tabID)
  $('#edit-tab').show()
  document.querySelector('.etabs-views').classList.add('blur')
}

$('#edit-tab-form').on('submit', () => {
  var tabID = $('#edit-id').val()
  var title = $('#title').val()
  var url = $('#url').val()
  $('#edit-tab').hide()
  document.querySelector('.etabs-views').classList.remove('blur')
  var tab = tradeTabs.getTabByPosition(Number(tabID) + 1)
  tab.setTitle(title)
  if (tab.webview.src !== url) {
    tab.webview.src = url
  }
})

module.exports = tradeTabs
