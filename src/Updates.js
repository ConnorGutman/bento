var React = require('react')

var SettingsStore = require('./stores/SettingsStore')
var UpdatesStore = require('./stores/UpdatesStore')

var DisplayListItem = require('./DisplayListItem')
var Paginator = require('./Paginator')
var Spinner = require('./Spinner')

var PageNumberMixin = require('./mixins/PageNumberMixin')

var {ITEMS_PER_PAGE} = require('./utils/constants')
var pageCalc = require('./utils/pageCalc')
var setTitle = require('./utils/setTitle')

function filterDead(item) {
  return !item.dead
}

function filterUpdates(updates) {
  if (!SettingsStore.showDead) {
    return {
      stories: updates.stories.filter(filterDead)
    }
  }
  return updates
}

var Updates = React.createClass({
  mixins: [PageNumberMixin],

  getInitialState() {
    return filterUpdates(UpdatesStore.getUpdates())
  },

  componentWillMount() {
    this.setTitle(this.props.type)
    UpdatesStore.start()
    UpdatesStore.on('updates', this.handleUpdates)
  },

  componentWillUnmount() {
    UpdatesStore.off('updates', this.handleUpdates)
    UpdatesStore.stop()
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.type !== nextProps.type) {
      this.setTitle(nextProps.type)
    }
  },

  setTitle(type) {
    setTitle('New Links')
  },

  handleUpdates(updates) {
    if (!this.isMounted()) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Skipping update of ' + this.props.type + ' as the Updates component is not mounted')
      }
      return
    }
    this.setState(filterUpdates(updates))
  },

  render() {
    var items = this.state.stories
    if (items.length === 0) {
      return <div className="Updates Updates--loading"><Spinner size="20"/></div>
    }

    var page = pageCalc(this.getPageNumber(), ITEMS_PER_PAGE, items.length)

      return <div className="Updates Items">
        <div className="container main-content Items__list" start={page.startIndex + 1}>
          {items.slice(page.startIndex, page.endIndex).map(function(item) {
            return <DisplayListItem key={item.id} item={item}/>
          })}
        </div>
        <Paginator route="newest" page={page.pageNum} hasNext={page.hasNext}/>
      </div>
  }
})

module.exports = Updates
