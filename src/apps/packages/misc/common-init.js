require('./minor-page-common.scss')

window.Global = new window.Base.Application()
import UIModule from 'skeleton/modules/ui'
import DialogModule from 'skeleton/modules/ui/dialog'
import NotificationModule from 'skeleton/modules/ui/notification'
import SyncModule from 'skeleton/modules/sync'
import OAuthModule from 'skeleton/modules/oauth'
import OauthMediatorModule from 'skeleton/modules/mediator/oauth'
import ValidatorModule from 'skeleton/modules/validator'
import MediatorModule from 'skeleton/modules/mediator'

window.Global.module('ui', UIModule)
window.Global.module('ui.dialog', DialogModule)
window.Global.module('ui.notification', NotificationModule)
window.Global.module('sync', SyncModule)
window.Global.module('oauth', OAuthModule)
window.Global.module('validator', ValidatorModule)
window.Global.module('m', MediatorModule)
window.Global.module('m.oauth', OauthMediatorModule)

if (window.ParsleyConfig) {
  window.ParsleyConfig.errorsWrapper = '<div class="js-pf-val-special-wrapper val-error-wrapper">&nbsp;</div>'
  window.ParsleyConfig.errorTemplate = '<div class="val-error-temp text-danger "></div>'
  window.ParsleyConfig.trigger = 'change'
}
