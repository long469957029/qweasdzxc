const ActiveCenterView = () => import(/* webpackChunkName: "active-center" */ './activeCenter')

export default [
  {
    path: '/aa',
    component(resolve) {
      RouterController.async(resolve, ActiveCenterView, {
        main: {
          title: '活动中心',
        },
      })
    }
  },
]
