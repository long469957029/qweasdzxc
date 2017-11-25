

const MediatorModule = require('skeleton/modules/mediator')
const UIModule = require('skeleton/modules/ui')
const DataModule = require('skeleton/modules/data')
const RouterModule = require('skeleton/modules/router')
const SettingModule = require('skeleton/modules/setting')

const MenuModule = require('skeleton/modules/ui/menu')
const SyncModule = require('skeleton/modules/sync')
const OAuthModule = require('skeleton/modules/oauth')
const LoaderModule = require('skeleton/modules/ui/loader')
const NotificationModule = require('skeleton/modules/ui/notification')
const DialogModule = require('skeleton/modules/ui/dialog')
const PollingModule = require('skeleton/modules/polling')
const ViewPollModule = require('skeleton/modules/viewPool')
const InputMonitorModule = require('skeleton/modules/inputMonitor')
const ValidatorModule = require('skeleton/modules/validator')

const OauthMediatorModule = require('skeleton/modules/mediator/oauth')
const NewsMediatorModule = require('skeleton/modules/mediator/news')

const VolcanicActivityModule = require('skeleton/modules/mediator/volcanicActivity')

// var TreadActivityModule = require('skeleton/modules/mediator/treadActivity');
// var RainActivityModule = require('skeleton/modules/mediator/rainActivity');
const TreeActivityModule = require('skeleton/modules/mediator/treeActivity')
const NewbieActivityModule = require('skeleton/modules/newbieActivity')

exports.install = function() {
  window.Global.module('viewPool', ViewPollModule)
  window.Global.module('router', RouterModule)
  window.Global.module('oauth', OAuthModule)
  window.Global.module('polling', PollingModule)
  window.Global.module('ui', UIModule)
  window.Global.module('data', DataModule)
  window.Global.module('sync', SyncModule)
  window.Global.module('m', MediatorModule)
  window.Global.module('inputMonitor', InputMonitorModule)
  window.Global.module('setting', SettingModule)
  window.Global.module('validator', ValidatorModule)

  window.Global.module('ui.menu', MenuModule)
  window.Global.module('ui.loader', LoaderModule)
  window.Global.module('ui.dialog', DialogModule)
  window.Global.module('ui.notification', NotificationModule)

  window.Global.module('m.news', NewsMediatorModule)
  window.Global.module('m.oauth', OauthMediatorModule)
  // window.Global.module('m.rainActivity', RainActivityModule);
  // window.Global.module('m.volcanicActivity', VolcanicActivityModule);
  // window.Global.module('m.treadActivity', TreadActivityModule);
  window.Global.module('m.treeActivity', TreeActivityModule)
  window.Global.module('newbieActivity', NewbieActivityModule)
}
