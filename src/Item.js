var React = require('react')
var ReactFireMixin = require('reactfire')
var TimeAgo = require('react-timeago').default

var HNService = require('./services/HNService')
var HNServiceRest = require('./services/HNServiceRest')
var ItemStore = require('./stores/ItemStore')

var PollOption = require('./PollOption')
var Spinner = require('./Spinner')
var ItemMixin = require('./mixins/ItemMixin')

var cx = require('./utils/buildClassName')
var setTitle = require('./utils/setTitle')

var SettingsStore = require('./stores/SettingsStore')

function timeUnitsAgo(value, unit, suffix) {
  if (value === 1) {
    return unit
  }
  return `${value} ${unit}s`
}

var Item = React.createClass({
  mixins: [ItemMixin, ReactFireMixin],

  getInitialState() {
    return {
      item: ItemStore.getCachedStory(Number(this.props.params.id)) || {}
    }
  },

  componentWillMount() {
    if (SettingsStore.offlineMode) {
      HNServiceRest.itemRef(this.props.params.id).then(function(res) {
        return res.json()
      }).then(function(snapshot) {
        this.replaceState({ item: snapshot })
      }.bind(this))
    }
    else {
      this.bindAsObject(HNService.itemRef(this.props.params.id), 'item')
    }

    if (this.state.item.id) {
      setTitle(this.state.item.title)
    }
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },

  componentWillUnmount() {
    if (this.threadStore) {
      this.threadStore.dispose()
    }
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      // Tear it down...
      this.threadStore.dispose()
      this.threadStore = null
      this.unbind('item')
      // ...and set it up again
      var item = ItemStore.getCachedStory(Number(nextProps.params.id))
      if (item) {
        setTitle(item.title)
      }

      if (SettingsStore.offlineMode) {
        HNServiceRest.itemRef(nextProps.params.id).then(function(res) {
          return res.json()
        }).then(function(snapshot) {
          this.replaceState({ item: snapshot })
        }.bind(this))
      }
      else {
        this.bindAsObject(HNService.itemRef(nextProps.params.id), 'item')
        this.setState({item: item || {}})
      }
    }
  },

  componentWillUpdate(nextProps, nextState) {
    // Update the title when the item has loaded.
    if (!this.state.item.id && nextState.item.id) {
      setTitle(nextState.item.title)
    }
  },

  componentDidUpdate(prevProps, prevState) {
  },

  render() {
    var state = this.state
    var item = state.item
    var threadStore = this.threadStore
    if (!item.id || !threadStore) { return <div className="Item Item--loading"><Spinner size="20"/></div> }
    return <div className={cx('Item', {'Item--dead': item.dead})}>
      <div className="Item__content">
        {this.renderItemTitle(item)}
        {this.renderItemMeta(item)}
        {item.text && <div className="Item__text">
          <div dangerouslySetInnerHTML={{__html: item.text}}/>
        </div>}
        {item.type === 'poll' && <div className="Item__poll">
          {item.parts.map(function(id) {
            return <PollOption key={id} id={id}/>
          })}
        </div>}
      </div>
    </div>
  }
})

module.exports = Item
