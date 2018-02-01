const RealCenterView = () => import(/* webpackChunkName: "outer-center" */ './realCenter.vue')

export default [
  {
    path: '/rc',
    component: RealCenterView
  },
]
