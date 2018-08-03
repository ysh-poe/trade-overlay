/* global $, HTMLMediaElement, app */
/* eslint camelcase: ["error", {properties: "never"}] */

const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', function() {
  (function() {
    // Poe.trade
    if (window.location.href.search('poe.trade') > -1) {
      // Event handler for whisper button
      $(document).on('click', 'a.whisper-btn', () => ipcRenderer.sendToHost('whisper'));

      // Hooking onto the jQuery Ajax function
      $(document).ajaxSuccess(function(a, b, c, response) {
        if (typeof response.count === 'undefined') {
          return;
        }
        ipcRenderer.sendToHost('notify');
        ipcRenderer.send('livesearch-item', 'poetrade', response);
      });
    } else if (window.location.href.search('poeapp.com') > -1) {
      // poeapp.com's framework makes it hard to properly register the event,
      // so instead we just hook into every onclick event and then select the ones that are on the whisper button
      document.addEventListener('click', e => {
        console.log(e);
        if (window.location.href.search('currency') === -1 && e.path[0].classList[0] === 'whisper-icon') {
          ipcRenderer.sendToHost('whisper');
        } else {
          if (e.path[1].classList[0] === 'whisper-currency-button') {
            ipcRenderer.sendToHost('whisper');
          }
        }
      });
      // The same issue exists with finding out if the livesearch has found a new item
      // The solution is too overwrite the HTMLMediaElement.play function and trigger the event everytime a sound plays
      const old = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function() {
        old.apply(this, arguments);
        ipcRenderer.sendToHost('notify');
      };
    } else if (window.location.href.search('pathofexile.com/trade') > -1) {
      // on pathofexile/trade the $ object does not exists on DOMContentLoaded
      // so we just wait until it does
      const interval = setInterval(function() {
        if (typeof $ !== 'undefined' && typeof app !== 'undefined') {
          $(document).on('click', 'button.whisper-btn', () => ipcRenderer.sendToHost('whisper'));

          $(document).ajaxSuccess(function(a, b, c, response) {
            if (app.searchLive) {
              if (
                response === null ||
                typeof response.result === 'undefined' ||
                typeof response.result[0].item === 'undefined'
              ) {
                return;
              }
              ipcRenderer.sendToHost('notify');
              ipcRenderer.send('livesearch-item', 'PathOfExileTrade', response);
            }
          });
          clearInterval(interval);
        }
      }, 10);
    }
  })();
});
