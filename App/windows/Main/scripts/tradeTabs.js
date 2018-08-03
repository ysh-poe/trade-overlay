const TabGroup = require('electron-tabs');
const { shell } = require('electron');
const $ = require('jquery');

const sendMessage = require('../../../scripts/windows.js');

class TradeTabs extends TabGroup {
  constructor() {
    super({
      newTab: {
        title: 'Poe Trade',
        src: 'http://poe.trade',
        visible: true,
        webviewAttributes: { preload: './scripts/preload.js' }
      }
    });
    this.initial = true;
  }

  addTradeTab(title, url) {
    this.addTab({
      title: title,
      src: url,
      visible: true,
      webviewAttributes: { preload: './scripts/preload.js' }
    });
  }

  loadTabGroup(tabList) {
    const tab = tabList.shift();
    if (tab !== null && tab !== undefined) {
      if (tab.url !== undefined) {
        this.addTab({
          title: tab.tabTitle,
          src: tab.url,
          visible: true,
          webviewAttributes: {
            preload: './scripts/preload.js'
          },
          ready: () => this.loadTabGroup(tabList)
        });
      }
    }
  }

  editTab(tabEvent, tab) {
    showEditForm(tab);
  }
}

const tradeTabs = new TradeTabs();

tradeTabs.on('tab-active', tab => {
  tab.setBadge(false);
  tab.flash(false);
});

tradeTabs.on('tab-added', (tab, tradeTabs) => {
  tab.activate();
  if (process.env.NODE_ENV === 'dev') tab.webview.addEventListener('dom-ready', () => tab.webview.openDevTools());
  // Event if whisper button is clicked
  tab.webview.addEventListener('ipc-message', event => {
    if (event.channel === 'whisper') {
      // For some reason it only sends the message on the second attempt,
      // so we just try to send the message twice on a new tab
      if (tradeTabs.initial) {
        setTimeout(sendMessage, 20);
        tradeTabs.initial = false;
      }
      setTimeout(sendMessage, 10);
    } else if (event.channel === 'notify') {
      if (tab.getBadge() === false || tab.getBadge() === null || tab.getBadge() === undefined) {
        tab.setBadge(1);
      } else {
        tab.setBadge(Number(tab.getBadge()) + 1);
      }
    }
  });

  // Reset Badge and flash if active
  tab.on('active', tab => {
    tab.setBadge(false);
    tab.flash(false);
  });

  // right click -> edit tab
  // middle click -> close tab
  tab.tab.addEventListener('auxclick', e => {
    if (e.button === 2) {
      tradeTabs.editTab(e, tab);
    } else if (e.button === 1) {
      tab.close();
    }
  });

  // External link event
  tab.webview.addEventListener('new-window', e => {
    const protocol = require('url').parse(e.url).protocol;
    if (protocol === 'http:' || protocol === 'https:') {
      shell.openExternal(e.url);
    }
  });
});

function showEditForm(tab) {
  $('#title').val(tab.getTitle());
  $('#url').val(tab.webview.src);
  $('#edit-id').val(tab.id);
  $('#edit-tab').show();
  $('.etabs-views')[0].classList.add('blur');
}

$('#edit-tab-form').on('submit', () => {
  const tabID = $('#edit-id').val();
  const title = $('#title').val();
  const url = $('#url').val();
  $('#edit-tab').hide();
  $('.etabs-views')[0].classList.remove('blur');
  const tab = tradeTabs.getTab(Number(tabID));
  tab.setTitle(title);
  if (tab.webview.src !== url) {
    tab.webview.src = url;
  }
});

$('#close-btn').on('click', () => {
  $('#edit-tab').hide();
  $('.etabs-views')[0].classList.remove('blur');
});

module.exports = tradeTabs;
