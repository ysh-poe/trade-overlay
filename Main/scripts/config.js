const Config = require('electron-config')

class MyConfig extends Config {
  storeTabGroup (tabGroup) {
    var tabList = []
    for (var tab of tabGroup.getTabs()) {
      console.log(tab)
      tabList.push({ url: tab.webview.src, tabTitle: tab.getTitle() })
    }
    this.set('tabs', tabList)
  }

  loadTabGroup () {
    return this.get('tabs')
  }
}

const config = new MyConfig()

module.exports = config
