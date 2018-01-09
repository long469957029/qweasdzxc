import BettingCenterController from 'bettingCenter/controller'

export default () => {
  window.Global.appRouter.processAppRoutes(new BettingCenterController(), {
    'bc/:type': 'bettingCenter',
    'bc/:type/:version': 'bettingCenter',
    'bc/betting/detail/:betId': 'bettingDetail',
    'bc/br/detail/:ticketId/:betId': 'bettingDetail', // 投注详情
  })
  // window.Global.appRouter.processAppRoutes(new BettingCenterController(), {
  //  'bc/:type': 'bettingCenter'
  // });
}
