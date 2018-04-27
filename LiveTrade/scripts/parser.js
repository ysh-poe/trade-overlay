var $ = require('jquery')

var Parser = {
  parsePoETrade: function (dom) {
    var searchResultsDom = $(dom).find('.item')
    var allItems = []

    searchResultsDom.each((index, item) => {
      $(item).find('.item-affix').html('')
      var propertiesOne = $(item).find('.cell-first .property')
      var propertiesTwo = $(item).find('.cell-second .property')
      let itemJSON = {
        icon: $(item).find('.icon img')[0].src,
        sockets: [],
        title: $(item).find('a.title')[0].text.trim(),
        corrupted: false,
        mods: {
          implicit: '',
          enchant: '',
          explicits: [],
          crafted: []
        },
        seller: {
          name: item.dataset.seller,
          ign: item.dataset.ign,
          buyout: item.dataset.buyout,
          league: item.dataset.league,
          tab: item.dataset.tab,
          x: item.dataset.x,
          y: item.dataset.y,
          whisper: ''
        },
        properties: {
          Quality: propertiesOne[0].innerText,
          Physical: propertiesOne[1].innerText,
          Elemental: propertiesOne[2].innerText,
          aps: propertiesOne[3].innerText,
          dps: propertiesOne[4].innerText,
          pdps: propertiesOne[5].innerText,
          edps: propertiesOne[6].innerText,
          armour: propertiesTwo[0].innerText,
          evasion: propertiesTwo[1].innerText,
          shield: propertiesTwo[2].innerText,
          critical: propertiesTwo[3].innerText,
          Level: propertiesTwo[4].innerText
        }
      }

      // Mods
      if (itemJSON.title.search('corrupted') > -1) itemJSON.corrupted = true
      itemJSON.title = itemJSON.title.replace('corrupted', '')
      if ($(item).find('.mods .sortable').length > 0) {
        var itemMods = $(item).find('.mods .sortable')
        itemMods.each((index, itemMod) => {
          if (itemMod.parentElement.classList.contains('withline')) itemJSON.mods.implicit = itemMod.innerText // implicit
          else if ($(itemMod).find('span.label-enchant').length === 1) itemJSON.mods.enchant = $(itemMod).find('span.label-enchant').parent().text().replace('enchanted ', '')
          else if ($(itemMod).find('span.label-crafted').length === 1) itemJSON.mods.crafted.push($(itemMod).find('span.label-crafted').parent().text().replace('crafted ', ''))
          else itemJSON.mods.explicits.push(itemMod.innerText)
        })
      }

      // Sockets
      $(item).find('.sockets-inner').children().each((key, socket) => {
        if (socket.classList.contains('socket')) {
          // socket
          if (socket.classList.contains('socketI')) itemJSON.sockets.push('B') // blue
          else if (socket.classList.contains('socketD')) itemJSON.sockets.push('G') // green
          else if (socket.classList.contains('socketS')) itemJSON.sockets.push('R') // red
          else if (socket.classList.contains('socketG')) itemJSON.sockets.push('W') // white
        } else if (socket.classList.contains('socketLink')) itemJSON.sockets.push('-') // Link
        else itemJSON.sockets.push(' ') // No Link
      })

      // Whisper
      itemJSON.seller.whisper = '@' + itemJSON.seller.ign + ' Hi, I would like to buy your ' + itemJSON.title
      if (itemJSON.seller.buyout.trim() !== '') itemJSON.seller.whisper += ' listed for ' + itemJSON.seller.buyout
      itemJSON.seller.whisper += ' in ' + itemJSON.seller.league
      if (typeof itemJSON.seller.tab !== 'undefined') itemJSON.seller.whisper += ' (stash tab ' + itemJSON.seller.tab + '; position: left ' + itemJSON.seller.x + ', top ' + itemJSON.seller.y + ')'

      allItems.push(itemJSON)
    })
    return allItems
  },
  parsePoE: function (json) {
    var allItems = []

    json.result.forEach((itemResult) => {
      let itemJSON = {
        icon: itemResult.item.icon,
        sockets: [],
        title: itemResult.item.name + ' ' + itemResult.item.typeLine,
        corrupted: false,
        mods: {
          implicit: (typeof itemResult.item.implicitMods !== 'undefined') ? itemResult.item.implicitMods[0] : '',
          enchant: (typeof itemResult.item.enchantMods !== 'undefined') ? itemResult.item.enchantMods[0] : '',
          explicits: (typeof itemResult.item.explicitMods !== 'undefined') ? itemResult.item.explicitMods : [],
          crafted: (typeof itemResult.item.craftedMods !== 'undefined') ? itemResult.item.craftedMods : []
        },
        seller: {
          name: itemResult.account.name,
          ign: itemResult.account.lastCharacterName,
          buyout: (typeof itemResult.item.note !== 'undefined') ? itemResult.item.note : '',
          league: itemResult.account.league,
          tab: itemResult.source.stash,
          x: itemResult.source.x,
          y: itemResult.source.y,
          whipser: itemResult.account.whisper
        },
        properties: {}
      }

      if (typeof itemResult.item.corrupted === 'undefined') itemJSON.corrupted = false
      else if (itemResult.item.corrupted === true) itemJSON.corrupted = true

      // Properties
      if (typeof itemResult.item.properties !== 'undefined') {
        for (const property of itemResult.item.properties) {
          if (typeof property.values[0] !== 'undefined') {
            itemJSON.properties[property.name] = property.values[0][0]
          }
        }
      }

      // Sockets
      var lastGroup = 0
      var starting = true
      if (typeof itemResult.item.sockets === 'object') {
        itemResult.item.sockets.forEach((socket) => {
          if (starting) {
            itemJSON.sockets.push(socket.sColour) // first socket
            starting = false
          } else {
            if (lastGroup !== socket.group) itemJSON.sockets.push(' ') // no link
            else itemJSON.sockets.push('-') // Link
            itemJSON.sockets.push(socket.sColour)
          }
        })
      }
      allItems.push(itemJSON)
    })
    return allItems
  }
}

module.exports = Parser
