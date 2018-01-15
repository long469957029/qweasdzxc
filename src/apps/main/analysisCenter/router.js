const AnalysisCenterView = () => import(/* webpackChunkName: "analysis-center" */ './index')

export default [
  {
    path: '/analysis/:ticketId',
    component: AnalysisCenterView,
    props: (route) => ({
      ticketId: Number(route.params.ticketId),
    }),
  },
]
