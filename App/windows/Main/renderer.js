const $ = require('jquery');
const { remote, ipcRenderer } = require('electron');
const browserWindow = remote.getCurrentWindow();

const config = require('../../scripts/config.js');
const tradeTabs = require('./scripts/tradeTabs.js');
const TitleBar = require('./scripts/titleBar.js');

const tabGroup = config.loadTabGroup();

const titleBar = new TitleBar({
  darkMode: false,
  color: 'rgb(220, 200, 200)',
  backgroundColor: 'rgb(32, 35, 64)',
  draggable: true,
  fullscreen: false
});

titleBar.appendTo($('.title-bar')[0]);
titleBar.addLink('http://pathofexile.com/trade', 'Pathofexile/trade');
titleBar.addLink('http://poe.trade', 'Poe.trade');
titleBar.addLink('http://poeapp.com', 'Poeapp.com');
titleBar.Bounds = browserWindow.getBounds();

// Registering the Events for the title bar buttons
titleBar.on('close', () => {
  browserWindow.close();
});

titleBar.on('fullscreen', () => {
  titleBar.Bounds = browserWindow.getBounds();
  browserWindow.setFullScreen(true);
  browserWindow.maximize();
});

titleBar.on('minimize', () => {
  browserWindow.hide();
});

titleBar.on('maximize', () => {
  browserWindow.setBounds(titleBar.Bounds);
  browserWindow.setFullScreen(false);
});

// loading tabs from config
if (tabGroup !== null && typeof tabGroup !== 'undefined' && tabGroup.length > 0) {
  tradeTabs.loadTabGroup(tabGroup);
} else {
  tradeTabs.addTab();
}

$('.add-tab').on('click', e => tradeTabs.addTradeTab(e.currentTarget.innerText, e.currentTarget.dataset.url));

$(document).on('click', '.title-bar-arrow', e => {
  if (config.get('collapsed') === true) {
    config.set('collapsed', false);
    e.currentTarget.className = 'title-bar-arrow down';
    $('.etabs-tabgroup').slideDown();
  } else {
    config.set('collapsed', true);
    e.currentTarget.className = 'title-bar-arrow right';
    $('.etabs-tabgroup').slideUp();
  }
});

if (config.get('collapsed') === true) {
  $('.title-bar-arrow').attr('class', 'title-bar-arrow right');
  $('.etabs-tabgroup').slideUp();
} else {
  $('.title-bar-arrow').attr('class', 'title-bar-arrow down');
  $('.etabs-tabgroup').slideDown();
}

// cogWheel got clicked
$(document).on('click', '.titlebar-controls .material-icons', () => {
  ipcRenderer.send('open-settings');
});

// Store the tabs on close
window.onbeforeunload = () => {
  config.storeTabGroup(tradeTabs);
};
