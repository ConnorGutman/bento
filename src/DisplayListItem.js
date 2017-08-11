var React = require('react')

var ItemMixin = require('./mixins/ItemMixin')
var ListItemMixin = require('./mixins/ListItemMixin')

/**
 * Display story title and metadata as a list item.
 * The story to display will be passed as a prop.
 */
var DisplayListItem = React.createClass({
  mixins: [ItemMixin, ListItemMixin],

  propTypes: {
    item: React.PropTypes.object.isRequired
  },

  componentWillMount() {
  },

  render() {
    return this.renderListItem(this.props.item)
  }
})

module.exports = DisplayListItem
