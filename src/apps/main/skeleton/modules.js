

import MediatorModule from 'skeleton/modules/mediator'
import UIModule from 'skeleton/modules/ui'
import DataModule from 'skeleton/modules/data'
import RouterModule from 'skeleton/modules/router'
import SettingModule from 'skeleton/modules/setting'

import MenuModule from 'skeleton/modules/ui/menu'
import SyncModule from 'skeleton/modules/sync'
import OAuthModule from 'skeleton/modules/oauth'
import LoaderModule from 'skeleton/modules/ui/loader'
import NotificationModule from 'skeleton/modules/ui/notification'
import DialogModule from 'skeleton/modules/ui/dialog'
import PollingModule from 'skeleton/modules/polling'
import ViewPollModule from 'skeleton/modules/viewPool'
import InputMonitorModule from 'skeleton/modules/inputMonitor'
import ValidatorModule from 'skeleton/modules/validator'

import OauthMediatorModule from 'skeleton/modules/mediator/oauth'
import NewsMediatorModule from 'skeleton/modules/mediator/news'

// const VolcanicActivityModule from 'skeleton/modules/mediator/volcanicActivity'

// var TreadActivityModule from 'skeleton/modules/mediator/treadActivity'
// var RainActivityModule from 'skeleton/modules/mediator/rainActivity'
// import TreeActivityModule from 'skeleton/modules/mediator/treeActivity'
// import NewbieActivityModule from 'skeleton/modules/newbieActivity'

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
  // window.Global.module('m.treeActivity', TreeActivityModule)
  // window.Global.module('newbieActivity', NewbieActivityModule)
}
