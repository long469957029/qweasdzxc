require('./scripts/modernizr')
require('./styles/normalize-3.0.2.css')
require('./styles/jquery.fullPage.css')

// from bower
const s = require('underscore.string/index')

_.mixin(s.exports())

require('./scripts/jquery.steps')
require('./scripts/bootstrap-datetimepicker')
require('./scripts/jquery.countdown')
require('./scripts/printThis')
require('./scripts/jquery.fullPage')

require('parsleyjs')
require('parsleyjs/dist/parsley.remote')
require('parsleyjs/src/i18n/zh_cn')

