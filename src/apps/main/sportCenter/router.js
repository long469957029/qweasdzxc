const SportCenterView = require('sportCenter/index')

export default [
  {
    path: '/sp',
    component: function() {
      RouterController.changeMainReginView(new SportCenterView())
    },
  },
]
