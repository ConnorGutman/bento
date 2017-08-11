var React = require('react')
var Link = require('react-router/lib/Link')

var Settings = require('./Settings')

var StoryStore = require('./stores/StoryStore')
var UpdatesStore = require('./stores/UpdatesStore')
var SettingsStore = require('./stores/SettingsStore')


var App = React.createClass({
  getInitialState() {
    return {
      showSettings: false,
      showChildren: false,
      prebootHTML: this.props.params.prebootHTML,
      collapsedHeader: false,
      headerHeight: 15,
      searchPosX: 15,
      searchPosY: 15,
      searchWidth: 'calc(100% - 30px)',
      searchHeight: 6,
      searchRadius: 5,
      searchTransform: 'translateY(-50%)',
      searchOpacity: 1,
      contentTop: 15,
      contentHeight: 77
    }
  },

  componentWillMount() {
    SettingsStore.load()
    StoryStore.loadSession()
    UpdatesStore.loadSession()
    if (typeof window === 'undefined') return
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },

  componentDidMount() {
    // Empty the prebooted HTML and hydrate using live results from Firebase
    this.setState({
      prebootHTML: '',
      showChildren: true
    })
    this.ds.addEventListener('wheel', this.detectScroll);
  },

  componentWillUnmount() {
    if (typeof window === 'undefined') return
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    this.ds.removeEventListener("wheel", this.detectScroll);
  },

  /**
   * Give stores a chance to persist data to sessionStorage in case this is a
   * refresh or an external link in the same tab.
   */
  handleBeforeUnload() {
    StoryStore.saveSession()
    UpdatesStore.saveSession()
  },

  detectScroll() {
    var delta;
    var headerHeight;
    if (event.wheelDelta) {
      delta = event.wheelDelta;
    } else {
      delta = -1 * event.deltaY;
    }
    if (delta < 0) {
      if (this.state.collapsedHeader === false) {
        this.setState({
          headerHeight: 8,
          searchPosX: 0,
          searchPosY: 0,
          searchWidth: '100%',
          searchHeight: 8,
          searchRadius: 0,
          searchTransform: 'translateY(0)',
          searchOpacity: 1,
          contentTop: 8,
          contentHeight: 84,
          collapsedHeader: true
        });
      }
    } else if (delta > 0) {
      if (this.state.collapsedHeader === true) {
        this.setState({
          headerHeight: 15,
          searchPosX: 15,
          searchPosY: 15,
          searchWidth: 'calc(100% - 30px)',
          searchHeight: 6,
          searchRadius: 5,
          searchTransform: 'translateY(-50%)',
          searchOpacity: 1,
          contentTop: 15,
          contentHeight: 77,
          collapsedHeader: false
        });
      }
    }
  },

  toggleSettings(e) {
    e.preventDefault()
    this.setState({
      showSettings: !this.state.showSettings
    })
  },

  render() {
    return <div className="App" onClick={this.state.showSettings && this.toggleSettings}>
      <div className="App__wrap">
        <div className="App__header" style={{height: this.state.headerHeight + "vh"}}>
          <h1>bento</h1>
          <div className="search-bar" style={{top: this.state.searchPosY + "vh", left: this.state.searchPosX + 'px', width: this.state.searchWidth, height: this.state.searchHeight + 'vh', borderRadius: this.state.searchRadius + 'px', transform: this.state.searchTransform, opacity: this.state.searchOpacity}}><input type="text" placeholder="Search" /><span><i className="fa fa-search search-bar-btn" aria-hidden="true"></i></span></div>
          <a className="App__settings" tabIndex="0" onClick={this.toggleSettings} onKeyPress={this.toggleSettings}>
            {this.state.showSettings ? 'hide settings' : 'settings'}
          </a>
          {this.state.showSettings && <Settings key="settings"/>}
        </div>
        <div ref={elem => this.ds = elem} className="App__content" style={{top: this.state.contentTop + 'vh', height: this.state.contentHeight + 'vh'}}>
          <div dangerouslySetInnerHTML={{ __html: this.state.prebootHTML }}/>
          {this.state.showChildren ? this.props.children : ''}
        </div>
        <div className="App__footer">
          <div className="container">
            <div className="row">
              <div className="col-12 col-m-1"></div>
              <div className="col-12 col-m-2">
                <Link to="/news" activeClassName="selected" className="App__homelink fa fa-inbox"></Link>{' '}
              </div>
              <div className="col-12 col-m-2">
                <Link to="/newest" activeClassName="selected" className="fa fa-search"></Link>{' | '}
              </div>
              <div className="col-12 col-m-2">
                <Link to="/show" activeClassName="selected" className="fa fa-plus"></Link>{' | '}
              </div>
              <div className="col-12 col-m-2">
                <Link to="/ask" activeClassName="selected" className="fa fa-user"></Link>{' | '}
              </div>
              <div className="col-12 col-m-2">
                <Link to="/jobs" activeClassName="selected" className="fa fa-sliders"></Link>{' | '}
              </div>
              <div className="col-12 col-m-2"></div>
          </div>
        </div>
          <Link to="/news" activeClassName="active" className="App__homelink">Jot</Link>{' '}
          <Link to="/newest" activeClassName="active">new</Link>{' | '}
          <Link to="/show" activeClassName="active">show</Link>{' | '}
          <Link to="/ask" activeClassName="active">ask</Link>{' | '}
          <Link to="/jobs" activeClassName="active">jobs</Link>
        </div>
      </div>
    </div>
  }

})

module.exports = App
