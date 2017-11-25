

const HomeView = require('./home')
const TicketsView = require('./tickets')
const VideoView = require('./video')
const ActivityView = require('./activity')
const JoinView = require('./join')
const ProductsView = require('./products')

module.exports = Backbone.Router.extend({

  routes: {
    '': 'home',
    products: 'products',
    video: 'video',
    tickets: 'tickets',
    'tickets/:id': 'tickets',
    join: 'join',
    activity: 'activity',
    ':anything': 'home',
  },

  _initialize() {
    Global.headerRegin.currentView.turn(window.location.hash)
  },

  home() {
    this._initialize()
    Global.mainRegin.show(new HomeView())
  },

  products() {
    this._initialize()
    Global.mainRegin.show(new ProductsView())
  },

  video() {
    this._initialize()
    Global.mainRegin.show(new VideoView())
  },

  tickets(id) {
    this._initialize()
    Global.mainRegin.show(new TicketsView({
      id,
    }))
  },

  activity() {
    this._initialize()
    Global.mainRegin.show(new ActivityView())
  },

  join() {
    this._initialize()
    Global.mainRegin.show(new JoinView())
  },
})
