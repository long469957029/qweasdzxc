const PointsMall = () => import(/* webpackChunkName: "points-mall" */ './index')

export default [
  {
    name: 'pointsMall',
    path: '/points',
    component: PointsMall,
    // props: (route) => ({
    //   ticketId: Number(route.params.ticketId),
    //   ticketType: Number(route.params.ticketType)
    // }),
  },
]
