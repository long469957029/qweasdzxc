
import MyPointsCard from '../my-points-card'
const MyPointsCardWrapper = Base.ItemView.extend({

  template: require('userCenter/templates/my-points-card.html'),

  onRender() {
    this.app = new Vue({
      template: `<div><my-points-card></my-points-card></div>`,
      components: {
        MyPointsCard
      },
      data: {},
      store: window.store,
      router: window.router,
      el: this.$el.find('#js-my-points-card')[0],
    })
  },
})

module.exports = MyPointsCardWrapper
