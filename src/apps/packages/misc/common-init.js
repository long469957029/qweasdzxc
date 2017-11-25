require('./minor-page-common.scss')

window.Global = new window.Base.Application()
const UIModule = require('skeleton/modules/ui')
const DialogModule = require('skeleton/modules/ui/dialog')
const NotificationModule = require('skeleton/modules/ui/notification')
const SyncModule = require('skeleton/modules/sync')
const OAuthModule = require('skeleton/modules/oauth')
const OauthMediatorModule = require('skeleton/modules/mediator/oauth')
const ValidatorModule = require('skeleton/modules/validator')
const MediatorModule = require('skeleton/modules/mediator')

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
