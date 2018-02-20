var pug = require('pug')
var fn = pug.compileFile('./LiveTrade/templates/item-big.pug')

var template = {
  createItemTemplate: function (item) {
    item.createSocket = this.createSocket
    console.log('####')
    console.log(item)
    return fn(item)
  },
  createSocket: function (sockets) {
    let addDiv = function (cssClass) {
      var div = document.createElement('div')
      div.className = cssClass
      return div
    }
    var div = document.createElement('div')
    div.className = 'sockets'

    var linkCounter = 0
    var socketCounter = 0
    sockets.forEach((socket, index) => {
      if (socket === '-' || socket === ' ') {
        if (socket === '-') {
          div.appendChild(addDiv('link link' + linkCounter))
        }
        linkCounter = linkCounter + 1
      } else {
        socketCounter = socketCounter + 1
        var socketDiv = addDiv('socket colour' + socket)
        if (socketCounter === 3 || socketCounter === 2 || socketCounter === 6) socketDiv.classList.add('socketRight')
        div.appendChild(socketDiv)
      }
    })
    return div.innerHTML
  }
}

module.exports = template
