var ElectronTitlebarWindows = require('electron-titlebar-windows')

class TitleBar extends ElectronTitlebarWindows {
  // have to overwrite this function to remove the fullscreen on dbclick effect
  init () {
    // Add click events
    this.minimizeButton.addEventListener('click', event => this.clickMinimize(event))
    this.resizeButton.addEventListener('click', event => this.clickResize(event))
    this.closeButton.addEventListener('click', event => this.clickClose(event))
  }

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

    var cogWheel = document.createElement('i')
    cogWheel.classList.add('material-icons')
    cogWheel.classList.add('md-light')
    cogWheel.innerText = 'settings'
    cogWheel.style.color = this.options.color
    this.titlebarElement.querySelector('.titlebar-controls').prepend(cogWheel)

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
