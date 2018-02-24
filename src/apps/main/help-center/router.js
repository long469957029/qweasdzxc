const HelpCenterView = () => import(/* webpackChunkName: "help-center" */ './index.vue')

export default [
  {
    name: 'help',
    path: '/hc',
    component: HelpCenterView,
  },
]
