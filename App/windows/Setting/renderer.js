const TitleBar = require('electron-titlebar-windows');
const { remote } = require('electron');
const settingForm = require('./scripts/settingForm.js');

const browserWindow = remote.getCurrentWindow();

const titleBar = new TitleBar({
  darkMode: false,
  color: 'rgb(220, 200, 200)',
  backgroundColor: 'rgb(5, 12, 27)',
  draggable: true,
  fullscreen: false
});

titleBar.appendTo(document.querySelector('.title-bar'));

titleBar.on('close', () => {
  browserWindow.close();
});

titleBar.on('fullscreen', () => {
  titleBar.Bounds = browserWindow.getBounds();
  browserWindow.setFullScreen(true);
  browserWindow.maximize();
});

titleBar.on('maximize', () => {
  browserWindow.setBounds(titleBar.Bounds);
  browserWindow.setFullScreen(false);
});

document.querySelector('.titlebar-minimize').remove();

settingForm.populateForm();

document.querySelector('form').addEventListener('submit', settingForm.saveSettings);
