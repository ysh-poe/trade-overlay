const { remote, ipcRenderer } = require('electron');
const currentWindow = remote.getCurrentWindow();
const $ = require('jquery');
const clipboardy = require('clipboardy');

const template = require('./scripts/template.js');
const Parser = require('./scripts/parser.js');
const sendMessage = require('../../scripts/windows.js');

window.itemQueue = [];
window.hasItem = false;

let interval = null;

currentWindow.on('show', () => {
  interval = setInterval(resize, 500);
});

currentWindow.on('hide', () => clearInterval(interval));

ipcRenderer.on('livesearch-item', (e, site, arg) => {
  let data;
  if (site === 'poetrade') {
    data = Parser.parsePoETrade(arg.data);
  } else {
    data = Parser.parsePoE(arg);
  }

  window.itemQueue = window.itemQueue.concat(data);
  if (!window.hasItem) {
    window.hasItem = true;
    next();
  }
  updateAmount();
});

$('.close').on('click', () => {
  currentWindow.hide();
});

$('.next').on('click', next);

$(document).on('click', 'a.whisper', e => {
  liveTradeMessage(e);
});

$(document).on('click', 'a.whisper-btn', () => {
  liveTradeMessage($('a.whisper'));
});

ipcRenderer.on('send-message', () => {
  liveTradeMessage($('a.whisper'));
});

ipcRenderer.on('next-item', next);

ipcRenderer.on('hide-live-search', () => {
  currentWindow.hide();
});

// If window gets closed, instead just hide it
window.onbeforeunload = function(e) {
  const parent = currentWindow.getParentWindow();

  if (parent !== null) {
    currentWindow.hide();
    e.returnValue = false;
  }
};

function next() {
  if (window.itemQueue.length > 0) {
    const templateObj = $(template.createItemTemplate(window.itemQueue.shift()));
    $('.content').html(templateObj);
    $('#seller').html(document.querySelector('div.item').dataset.ign);
    $('#price').html(document.querySelector('div.item').dataset.price);
  } else {
    $('.content').html('');
    $('#seller').html('none');
    $('#price').html('undefined');
    window.hasItem = false;

    remote.getCurrentWindow().hide();
  }
  // resize Window to better fit the content

  resize();
  updateAmount();
}

// We cannot resize the window from the render, so we send it to the main process
function resize() {
  let width;
  if ($('.mainArea')[0].offsetWidth > 490) width = $('.mainArea')[0].offsetWidth;
  else width = 490;
  ipcRenderer.send('resize', $('.mainArea')[0].offsetHeight, width);
}

function updateAmount() {
  $('#amount').html(window.itemQueue.length);
}

function liveTradeMessage() {
  clipboardy.writeSync(document.querySelector('div.item').dataset.whisper);
  next();
  sendMessage();
}
