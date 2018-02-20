var ElectronTitlebarWindows = require('electron-titlebar-windows')

class TitleBar extends ElectronTitlebarWindows {
  constructor (options) {
    super(options)
    this.linkDiv = document.createElement('div')
    this.linkDiv.className = 'title-bar-links'

    var arrowDiv = document.createElement('div')
    arrowDiv.className = 'titlebar-arrow'

    var arrow = document.createElement('div')
    arrow.className = 'title-bar-arrow right'
    arrow.style.borderColor = this.options.color

    arrowDiv.appendChild(arrow)
    this.linkDiv.appendChild(arrowDiv)

    this.titlebarElement.prepend(this.linkDiv)
  }

  addLink (url, title) {
    var button = document.createElement('button')
    button.className = 'add-tab'
    button.dataset.url = url
    button.innerHTML = title
    button.style.color = this.options.color
    this.linkDiv.appendChild(button)
  }
}

module.exports = TitleBar
