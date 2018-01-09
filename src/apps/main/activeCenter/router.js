const ActiveCenterView = require('activeCenter/activeCenter')

export default [
  {
    path: '/aa',
    component: function() {
      RouterController.changeMainReginView(new ActiveCenterView(), {
        main: {
          title: '活动中心',
        },
      })
    }
  },
]
