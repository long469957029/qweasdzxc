

require('./../misc/common.js')
require('./index.scss')

const activityId = Number(_.getUrlParam('id')) || 1

Global.m.oauth.check({
  autoLogout: false,
}).fail((xhr, resType, type) => {
  if (resType === 'error') {
    if (type === 'Unauthorized') {
      Global.ui.notification.show('您还未登录,请登录账号！', {
        event () {
          window.location.href = 'login.html'
        },
      })
    }
  }
})
  .done(() => {
    switch (activityId) {
      case 1:
        require.ensure(['./raffle'], (require) => {
          init(require('./raffle'), activityId)
        }, 'raffle')
        break
      case 2:
        require.ensure(['./card'], (require) => {
          init(require('./card'), activityId)
        }, 'card')
        break
      case 3:
        require.ensure(['./rain'], (require) => {
          init(require('./rain'), activityId)
        }, 'rain')
        break
      case 4: case 5: case 6: case 7: case 44:
        require.ensure(['./rebate'], (require) => {
          init(require('./rebate'), activityId)
        }, 'rebate')
        break
      case 8:
        require.ensure(['./plain'], (require) => {
          init(require('./plain'), activityId)
        }, 'plain')
        break
      case 9:
        require.ensure(['./tree'], (require) => {
          init(require('./tree'), activityId)
        }, 'tree')
        break
      case 13:
        require.ensure(['./recharge'], (require) => {
          init(require('./recharge'), activityId)
        }, 'tree')
        break
      case 14:
        require.ensure(['./newbie'], (require) => {
          init(require('./newbie'), activityId)
        }, 'newbie')
        break
      case 26:
        require.ensure(['./daily'], (require) => {
          init(require('./daily'), activityId)
        }, 'daily')
        break
      case 34:
        require.ensure(['./daily_z'], (require) => {
          init(require('./daily_z'), activityId)
        }, 'daily_z')
        break
      case 45:
        require.ensure(['./distributorDaily'], (require) => {
          init(require('./distributorDaily'), activityId)
        }, 'distributorDaily')
        break
    }
  })

function init(CurrentView, activityId) {
  new CurrentView({
    el: '.js-package',
    activityId,
  }).render()
}

