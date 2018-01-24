const HelpCenterView = () => import(/* webpackChunkName: "help-center" */ './index.vue')

export default [
  {
    path: '/hc',
    component: HelpCenterView,
  },
]
