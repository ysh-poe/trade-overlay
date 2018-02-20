var jade = require('jade')
var fn = jade.compileFile('./LiveTrade/templates/item-big.jade')

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

    var socketCounter = 0
    var linkCounter = 0
    sockets.forEach((socket) => {
      if (socket === '-' || socket === ' ') {
        if (socket === '-') {
          div.appendChild(addDiv('link link' + linkCounter))
        }
        linkCounter++
      } else {
        socketCounter++
        var socketDiv = addDiv('socket colour' + socket)
        if (socketCounter % 2 === 0) socketDiv.classList.add('socketRight')
        div.appendChild(socketDiv)
      }
    })
    return div.innerHTML
  }
}

module.exports = template
