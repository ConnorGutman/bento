var React = require('react')
var Link = require('react-router/lib/Link')

var SettingsStore = require('../stores/SettingsStore')
var cx = require('../utils/buildClassName')

/**
 * Reusable logic for displaying an item in a list.
 * Must be used in conjunction with ItemMixin for its rendering methods.
 */
var ListItemMixin = {

  renderListItem(item, threadState) {
    if (item.deleted) { return null }
    return <div className={cx('row post ListItem', {'ListItem--dead': item.dead})} style={{marginBottom: SettingsStore.listSpacing}}>
      <div className="post-controls"><h1><i className="fa fa-user" aria-hidden="true"></i></h1> </div>
      <div className="col-12 post-card">
      <p>{this.renderItemTitle(item)}</p>
      <p className="post-meta"><i className="fa fa-circle offline" aria-hidden="true"></i>{this.renderItemMeta(item)}</p>
      </div>
    </div>
  }
}

module.exports = ListItemMixin
