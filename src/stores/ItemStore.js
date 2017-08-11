var HNService = require('../services/HNService')
var HNServiceRest = require('../services/HNServiceRest')

var StoryStore = require('./StoryStore')
var UpdatesStore = require('./UpdatesStore')
var SettingsStore = require('./SettingsStore')
var titleCache = {}

var ItemStore = {
  getItem(id, cb, result) {
    var cachedItem = this.getCachedItem(id)
    if (cachedItem) {
      if (result) {
        result.cacheHits++
      }
      setImmediate(cb, cachedItem)
    }
    else {
      if (SettingsStore.offlineMode) {
        HNServiceRest.fetchItem(id, cb)
      }
      else {
        HNService.fetchItem(id, cb)
      }
    }
  },

  getCachedItem(id) {
    return StoryStore.getItem(id) || UpdatesStore.getItem(id) || null
  },

  getCachedStory(id) {
    return StoryStore.getItem(id) || UpdatesStore.getStory(id) || null
  }
}

module.exports = ItemStore
