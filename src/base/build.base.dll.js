require('csshake')
require('animate.css')

window.Backbone = require('backbone')
window.Base = require('./scripts/base')

require('./scripts/utils')
require('./scripts/triggerMehtod')
require('./scripts/domRefresh')
require('./scripts/entityEvents')
require('./scripts/logger')
require('./scripts/storage')
require('./scripts/error')
require('./scripts/callbacks')
require('./scripts/controller')
require('./scripts/baseObject')
require('./scripts/region')
require('./scripts/regionManager')
require('./scripts/mediator')
require('./scripts/mediator-permissions')
require('./scripts/mediator-facade')
require('./scripts/view')
require('./scripts/view-item')
require('./scripts/view-layout')
require('./scripts/view-prefab')
require('./scripts/appRouter')
require('./scripts/application')
require('./scripts/module')

require('jquery-ui/ui/core')
require('jquery-ui/ui/widget')
require('jquery-ui/ui/widgets/mouse')
require('jquery-ui/ui/position')
require('jquery-ui/ui/widgets/button')
require('jquery-ui/ui/widgets/slider')
require('jquery-ui/ui/widgets/spinner')

$.widget.bridge('uiButton', $.ui.button)

require('./scripts/bootstrap')

window.moment = require('moment')

window.moment.locale('zh-cn')

require('../vendor/build.core')

