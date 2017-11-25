

const GameCenterController = require('gameCenter/controller')

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new GameCenterController(), {
    'gc/tr': 'ticketRecord',
    'gc/cr': 'chaseRecord',
    'gc/gr': 'gameRecord',
    // "gc/rer": 'realBetRecord',
    // 'gc/slr': 'slotBetRecord',
    // 'gc/spr': 'sportBetRecord',
    // 'gc/fir': 'fisherBetRecord',
    'gc/sc': 'slotCenter',
    'gc/scmg': 'slotCenterMG',
  })
}
