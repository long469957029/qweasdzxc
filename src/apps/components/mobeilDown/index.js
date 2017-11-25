

require('./style.css')
// require("./jquery-1.10.2");
// require('./effect');

const mobilDown = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-off-mobilDown': 'offHandel',
    // 'click .vip-btn':"offHandel"
  },

  onRender() {
    const self = this
    // var storage=window.localStorage;
    // storage.setItem("c",1);
  },

  offHandel () {
    this.$('.js-mobilDown').parent().remove()
  },

})

module.exports = mobilDown
