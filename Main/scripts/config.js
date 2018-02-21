const Config = require('electron-config')

class MyConfig extends Config {
  storeTabGroup (tabGroup) {
    var tabList = []
    for (var tab of tabGroup.getTabs()) {
      console.log(tab)
      tabList.push({ src: tab.webview.src, title: tab.getTitle() })
    }
    this.set('tabList', tabList)
  }

  loadTabGroup () {
    return this.get('tabList').reverse()
  }
}

const config = new MyConfig({
  defaults: {
    collapsed: false,
    tabList: [{
      src: 'http://poe.trade',
      title: 'Poe.trade'
    }],
    winBounds: { x: 0, y: 0, height: 600, width: 1000 },
    winLiveTradeBounds: { x: 0, y: 0, height: 600, width: 1000 }
  }
})

module.exports = config
