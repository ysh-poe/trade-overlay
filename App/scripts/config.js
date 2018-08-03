const Config = require('electron-config');

class MyConfig extends Config {
  constructor() {
    super({
      defaults: {
        collapsed: false,
        winBounds: {
          x: 502,
          y: 229,
          width: 1091,
          height: 764
        },
        winLiveTradeBounds: {
          x: 0,
          y: 0,
          width: 490,
          height: 74
        },
        hotkeys: {
          showApp: 'F6',
          sendMessage: 'F7',
          nextItem: 'F8',
          hideLive: 'F9'
        },
        tabs: [
          {
            url: 'http://poe.trade/',
            tabTitle: 'Poe.trade'
          }
        ],
        liveSearch: {
          corner: 'topLeft',
          smallSockets: false,
          template: 'item-big'
        }
      }
    });
  }

  storeTabGroup(tabGroup) {
    const tabList = [];
    for (const tab of tabGroup.getTabs()) {
      tabList.push({ url: tab.webview.src, tabTitle: tab.getTitle() });
    }
    this.set('tabs', tabList);
  }

  loadTabGroup() {
    return this.get('tabs');
  }
}

const config = new MyConfig();
module.exports = config;
