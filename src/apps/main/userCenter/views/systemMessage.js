
const SystemMessageView = Base.ItemView.extend({

  template: require('userCenter/templates/systemMessage.html'),

  className: '',

  startOnLoading: true,

  events: {

  },


  onRender() {
    this.loadingFinish()
  },

})

module.exports = SystemMessageView
