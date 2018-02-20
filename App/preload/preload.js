/* global $, live_notify */
/* eslint camelcase: ["error", {properties: "never"}] */

const { ipcRenderer } = require('electron')

document.addEventListener('DOMContentLoaded', function (event) {
  (function () {
    // Poe.trade
    if (window.location.href.search('poe.trade') > -1) {
      // Event handler for whisper button
      $(document).on('click', 'a.whisper-btn', () => ipcRenderer.sendToHost('whisper'))

      // The live_notify function is the function on poe.trade that notifies the user when a new item was found in the Live Search
      // This function gets overwritten to notify the renderer that a new item was found and that it should update the badge
      var old = live_notify // eslint-disable-line
      /* exported live_notify */
      live_notify = () => { // eslint-disable-line
        old()
        ipcRenderer.sendToHost('notify')
      }

    // Hooking onto the jQuery Ajax function
      $(document).ajaxSuccess(function (a, b, c, reponse) {
        ipcRenderer.send('livesearch-item', 'poetrade', reponse)
      })
    } else if (window.location.href.search('poeapp.com') > -1) {
      // poeapp.com's framework makes it hard to properly register the event,
      // so instead we just hook into every onclick event and then select the ones that are on the whisper button
      document.onclick = (e) => {
        if (e.path.length === 32 || e.path.length === 30) { // 32 => for items, 30 => for currency TODO: limit this more
          ipcRenderer.sendToHost('whisper')
        }
      }
      // The same issue exists with finding out if the livesearch has found a new item
      // The solution is too overwrite the HTMLMediaElement.play function and trigger the event everytime a sound plays
      var old = HTMLMediaElement.prototype.play // eslint-disable-line
      HTMLMediaElement.prototype.play = function () { // eslint-disable-line
        old.apply(this, arguments)
        ipcRenderer.sendToHost('notify')
      }
    } else if (window.location.href.search('pathofexile.com/trade')) {
      // on pathofexile/trade the $ object does not exists ondocumentready
      // so we just wait until it does
      var interval = setInterval(function () {
        if (typeof $ !== 'undefined' && typeof app !== 'undefined') { // eslint-disable-line
          $(document).on('click', 'button.whisper-btn', () => ipcRenderer.sendToHost('whisper'))

          var old = HTMLMediaElement.prototype.play // eslint-disable-line
          HTMLMediaElement.prototype.play = function () { // eslint-disable-line
            old.apply(this, arguments)
            ipcRenderer.sendToHost('notify')
          }

          $(document).ajaxSuccess(function (a, b, c, reponse) {
            if (app.searchLive) { // eslint-disable-line
              ipcRenderer.send('livesearch-item', 'PathOfExileTrade', reponse)
            }
          })
          clearInterval(interval)
        }
      }, 10)
    }
  })()
})
