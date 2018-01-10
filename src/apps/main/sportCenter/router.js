const SportCenterView = () => import(/* webpackChunkName: "outer-center" */ './index')

export default [
  {
    path: '/sp',
    component: function(resolve) {
      RouterController.async(resolve, SportCenterView)
    },
  },
]
