const HelpCenterView = () => import(/* webpackChunkName: "help-center" */ './index')

export default [
  {
    path: '/hc',
    component: function(resolve) {
      RouterController.async(resolve, HelpCenterView)
    },
  },
]
