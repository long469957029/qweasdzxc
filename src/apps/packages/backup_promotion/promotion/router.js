// "use strict";
//
// var HomeView = require('./home');
// var TicketsView = require('./tickets');
// var VideoView = require('./video');
// var ActivityView = require('./activity');
// var JoinView = require('./join');
// var ProductsView = require('./products');
//
// module.exports = Backbone.Router.extend({
//
//   routes: {
//     '': 'home',
//     'products': 'products',
//     'video': 'video',
//     'tickets': 'tickets',
//     'tickets/:id': 'tickets',
//     'join': 'join',
//     'activity': 'activity',
//     ':anything': 'home'
//   },
//
//   _initialize: function() {
//     Global.headerRegin.currentView.turn(window.location.hash);
//   },
//
//   home: function() {
//     this._initialize();
//     Global.mainRegin.show(new HomeView());
//   },
//
//   products: function() {
//     this._initialize();
//     Global.mainRegin.show(new ProductsView());
//   },
//
//   video: function() {
//     this._initialize();
//     Global.mainRegin.show(new VideoView());
//   },
//
//   tickets: function(id) {
//     this._initialize();
//     Global.mainRegin.show(new TicketsView({
//       id: id
//     }));
//   },
//
//   activity: function() {
//     this._initialize();
//     Global.mainRegin.show(new ActivityView());
//   },
//
//   join: function() {
//     this._initialize();
//     Global.mainRegin.show(new JoinView());
//   }
// });
