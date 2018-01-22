const AnalysisCenterView = () => import(/* webpackChunkName: "analysis-center" */ './index')

export default [
  {
    name: 'analysis',
    path: '/analysis/:ticketId',
    component: AnalysisCenterView,
    props: (route) => ({
      ticketId: Number(route.params.ticketId),
    }),
  },
]
