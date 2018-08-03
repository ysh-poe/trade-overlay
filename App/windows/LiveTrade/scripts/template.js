const pug = require('pug');
const config = require('../../../scripts/config.js');
let fn;

const template = {
  createItemTemplate: function(item) {
    switch (config.get('liveSearch.template')) {
      case 'item-medium':
        fn = pug.compileFile('./App/windows/LiveTrade/templates/item-medium.pug');
        break;
      case 'item-small':
        fn = pug.compileFile('./App/windows/LiveTrade/templates/item-small.pug');
        break;
      case 'item-big':
        fn = pug.compileFile('./App/windows/LiveTrade/templates/item-big.pug');
        break;
      default:
        fn = pug.compileFile('./App/windows/LiveTrade/templates/item-medium.pug');
        break;
    }
    if (config.get('liveSearch.smallSockets') === true) item.createSocket = template.createSocketSmall;
    else item.createSocket = template.createSocket;
    return fn(item);
  },
  createSocket: function(sockets) {
    const wrapper = document.createElement('div');
    const addDiv = function(cssClass) {
      const div = document.createElement('div');
      div.className = cssClass;
      return div;
    };
    const div = document.createElement('div');
    div.className = 'sockets';

    let linkCounter = 0;
    let socketCounter = 0;
    sockets.forEach(socket => {
      if (socket === '-' || socket === ' ') {
        if (socket === '-') {
          div.appendChild(addDiv('link link' + linkCounter));
        }
        linkCounter = linkCounter + 1;
      } else {
        socketCounter = socketCounter + 1;
        const socketDiv = addDiv('socket colour' + socket);
        if (socketCounter === 3 || socketCounter === 2 || socketCounter === 6) socketDiv.classList.add('socketRight');
        div.appendChild(socketDiv);
      }
    });
    wrapper.appendChild(div);
    return wrapper.innerHTML;
  },
  createSocketSmall: function(sockets) {
    const wrapper = document.createElement('div');
    let addDiv = function(cssClass) {
      const div = document.createElement('div');
      div.className = cssClass;
      return div;
    };
    const div = document.createElement('div');
    div.className = 'sockets small';

    let linkCounter = 0;
    let socketCounter = 0;
    sockets.forEach(socket => {
      if (socket === '-' || socket === ' ') {
        if (socket === '-') {
          div.appendChild(addDiv('linkSmall link' + linkCounter));
        }
        linkCounter = linkCounter + 1;
      } else {
        socketCounter = socketCounter + 1;
        let socketDiv;
        socketDiv = addDiv('socketSmall colour' + socket);
        if (socketCounter === 3 || socketCounter === 2 || socketCounter === 6) socketDiv.classList.add('socketRight');
        div.appendChild(socketDiv);
      }
    });
    wrapper.appendChild(div);
    return wrapper.innerHTML;
  }
};

module.exports = template;
