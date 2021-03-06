const core = require('mathjs/core')

import {repeat, fill, chunk, cloneDeep, forEachRight, remove, slice, reverse} from 'lodash'

const math = core.create()

math.import(require('mathjs/lib/function/arithmetic/add'))
math.import(require('mathjs/lib/function/arithmetic/subtract'))
math.import(require('mathjs/lib/function/arithmetic/multiply'))
math.import(require('mathjs/lib/function/arithmetic/divide'))
math.import(require('mathjs/lib/function/arithmetic/floor'))
math.import(require('mathjs/lib/function/probability/combinations'))

const gameConfig = require('skeleton/misc/gameConfig')

_.mixin({
  cloneDeep,
  repeat,
  fill,
  chunk,
  forEachRight,
  remove,
  slice,
  reverse,
  // 首字母大写
  ucFirst(string) {
    return string.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1)
    })
  },

  combinations: math.combinations,

  serializeObject(serializeArray) {
    return _(serializeArray).reduce((obj, prop) => {
      if (prop.name.indexOf('[]') === -1) {
        obj[prop.name] = prop.value
      } else {
        prop.name = prop.name.replace('[]', '')
        if (_.isArray(obj[prop.name])) {
          obj[prop.name].push(prop.value)
        } else {
          obj[prop.name] = [prop.value]
        }
      }

      return obj
    }, {})
  },
  unique(arr) {
    const unique = []
    const repeat = []
    const hash = {}

    if (!_.isEmpty(arr)) {
      const length = arr.length
      for (var i = 0, elem; i < length; i++) {
        elem = arr[i]
        if (!hash[elem]) {
          unique.push(elem)
          hash[elem] = true
        } else {
          repeat.push(elem)
        }
      }
    }

    return {
      unique,
      repeat,
    }
  },

  zhLength(str) {
    return str.replace(/[\u4e00-\u9fa5]/g, '**').length
  },

  fixedConvert2yuan(money, options) {
    options = _.extend({}, {
      fixed: 3,
      clear: false,
    }, options)
    return _.convert2yuan(money, options)
  },

  convert2yuan(money, options) {
    options = _.extend({}, {
      fixed: 4,
      ratio: 10000,
      clear: true,
    }, options)

    return _.formatDiv(money, options.ratio, options)
  },

  convert2Point(money, options) {
    options = _.extend({}, {
      fixed: 2,
      ratio: 100000,
      clear: true,
    }, options)

    return _.formatDiv(money, options.ratio, options)
  },

  format2yuan(money, options) {  //临时方法 处理金额类数据，0的收显示0.00  其他情况正常除以10000，保留4位小数
    if (money === 0) {
      options = _.extend({}, {
        fixed: 2,
        ratio: 10000,
        clear: false,
      }, options)
    }
    return _.convert2yuan(money, options)
  },

  formatDiv(money, ratio, options) {
    let format

    money = money || 0

    options = _.extend({}, {}, options)

    if (!_.isUndefined(money)) {
      format = _(money).div(ratio)

      if (options.fixed || options.fixed === 0) {
        format = format.toFixed(options.fixed)
      }

      if (options.clear) {
        format = math.add(format, 0)
      }
    }

    return format
  },

  formatMul(money, ratio, {clear = true, fixed = 0} = {clear: true, fixed: 4}) {
    let format

    if (!_.isUndefined(money)) {
      format = _(money).mul(ratio)

      if (fixed) {
        format = format.toFixed(fixed)
      }

      if (clear) {
        format = math.add(format, 0)
      }
    }

    return format
  },

  toLink(arg) {
    const href = window.location.href
    const index = href.indexOf('/index.html')
    if (index > -1) {
      return href.substring(0, index) + arg
    }
    return href.substring(0, href.indexOf('/#')) + arg
  },

  // 格式化时间
  toTime(timestamp, format) {
    return timestamp ? moment(timestamp).format(format || 'YYYY-MM-DD H:mm:ss') : timestamp
  },

  toDate(timestamp, format) {
    return timestamp ? moment(timestamp).format(format || 'YYYY-MM-DD') : timestamp
  },

  // 格式化时间
  formatTime(timestamp, format) {
    return timestamp ? moment(timestamp).format(format || 'YYYY-MM-DD H:mm:ss') : timestamp
  },

  formatDate(timestamp, format) {
    return timestamp ? moment(timestamp).format(format || 'YYYY-MM-DD') : timestamp
  },

  formatAMPM(timestamp, format) {
    return timestamp ? moment(timestamp).format(format || 'h:mm A') : timestamp
  },

  add(arg1, arg2) {
    return math.add(arg1, arg2)
  },

  // 除法   arg1除arg2
  div(arg1, arg2) {
    arg1 = arg1 || 0
    return math.divide(arg1, arg2)
  },

  // 乘法  arg1乘arg2
  mul(arg1, arg2) {
    arg1 = arg1 || 0
    return math.multiply(arg1, arg2)
  },

  // 减法 arg1减arg2
  sub(arg1, arg2) {
    return math.subtract(arg1, arg2)
  },

  floor(arg1, index) {
    const sArg1 = String(arg1)
    const pos = sArg1.indexOf('.')
    if (pos > -1) {
      return Number(sArg1.substring(0, pos + index + 1))
    }
    return arg1
  },


  // 将小驼峰式转成 user-id 格式
  toDataStyle(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase()
  },

  addHrefArgs(href, args, val) {
    const nArgs = this.getUrlParam('', href) || {}

    if (!_(args).isObject()) {
      nArgs[args] = val
    } else {
      _(nArgs).extend(args)
    }

    href = href.replace(/\?.*/, '')

    _(nArgs).each((val, arg) => {
      if (!/\?.*=/.test(href)) {
        href += `?${arg}=${encodeURI(val)}`
      } else {
        href += `&${arg}=${encodeURI(val)}`
      }
    })

    return href
  },

  getUrl(uri, args, val) {
    let url

    let match = location.hash.match(/#?(.*)(\?.*)/)

    if (!match || !match[2]) {
      match = location.hash.match(/#?(.*)(\??.*)/)
    }

    if (!match) {
      url = `#${uri || ''}`
    } else {
      url = `#${match[1]}${uri}${match[2]}`
    }

    if (args) {
      url = this.addHrefArgs(url, args, val)
    }

    return url
  },

  getUrlParamStr(name, href) {
    const match = (href || window.location.href).match(/#?.*\?(.*)/)

    if (!match) {
      return ''
    }
    return `?${match[1]}`
  },


  getUrlParam(name, href) {
    const params = {}
    const match = (href || window.location.href).match(/#?.*\?(.*)/)

    if (!match) {
      return match
    }

    _(match[1].split('&')).each((arg) => {
      arg = arg.split('=')
      params[arg[0]] = decodeURI(arg[1])
    })

    if (name) {
      return params[name]
    }
    return params
  },
  getDomainWithNewPrefix(prefix) {
    let hostName = window.location.hostname
    let port = window.location.port
    let hostNameAttrArr = hostName.split('.')
    let newHostNameAttrArr = []
    newHostNameAttrArr.unshift(hostNameAttrArr.pop())//+':'+port
    newHostNameAttrArr.unshift(hostNameAttrArr.pop())
    newHostNameAttrArr.unshift(window.location.protocol + '//' + prefix)
    return newHostNameAttrArr.join('.')
  },

  // config文件用方法
  getConfig(config, index) {
    if (_(index).isUndefined()) {
      return config
    }
    return (_(config).findWhere({
      index,
    }) || {})
  },

  getConfigById(config, id) {
    return (_(config).findWhere({
      id,
    }) || {}).zhName || id
  },

  getCustomerServiceUrl() {
    return `https://szzero.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=576264&configID=53412&jid=9259996324&s=1&enterurl=${encodeURIComponent(window.location.href)}`
  },
  // hasOwn : function(){
  //   return window.Object.prototype.hasOwnProperty
  // },
  deepCopy(source) {
    let copy,
      i,
      len,
      prop
    if (typeof source !== 'object' || source == null || typeof source.nodeType === 'number') {
      copy = source
    } else if (typeof source.length === 'number') {
      copy = []
      for (i = 0, len = source.length; i < len; i++) {
        if (window.Object.prototype.hasOwnProperty.call(source, i)) {
          copy[i] = _(source[i]).deepCopy()
        }
      }
    } else {
      copy = {}
      for (prop in source) {
        if (window.Object.prototype.hasOwnProperty.call(source, prop)) {
          copy[prop] = _(source[prop]).deepCopy()
        }
      }
    }
    return copy
  },
  getChannelById(id) {
    return gameConfig.getChannelById(id) || id
  },
  getChannelList() {
    return gameConfig.getChannelList()
  },
  getGameTypeById(typeId) {
    return gameConfig.getChannelById(typeId)
  },
  getGameTypeList() {
    return gameConfig.getGameTypeList()
  },


  /**
   * 键盘验证
   */
  validateNumber(keyCode) {
    // 数字
    if (keyCode >= 48 && keyCode <= 57) return true
    // 小数字键盘
    if (keyCode >= 96 && keyCode <= 105) return true
    // Backspace, del, 左右方向键
    if (keyCode === 8 || keyCode === 46 || keyCode === 37 || keyCode === 39) return true

    return false
  },

  getV2Domain() {//game.hr4g.com  => gamev2.hr4g.com; hr4g.com  => v2.hr4g.com
    let hostName = window.location.hostname
    let hostNameAttrArr = hostName.split('.')
    let newHostNameAttrArr = []
    newHostNameAttrArr.unshift(hostNameAttrArr.pop())
    newHostNameAttrArr.unshift(hostNameAttrArr.pop())
    let secondDomain = hostNameAttrArr.pop()
    if (secondDomain === 'www') {
      secondDomain = 'v2'
    } else if (secondDomain) {
      secondDomain += 'v2'
    } else {
      secondDomain = 'v2'
    }
    newHostNameAttrArr.unshift(secondDomain)
    return 'http://' + newHostNameAttrArr.join('.')
  },
  formatError(data) {
    const errorTpl = `<div class="m-top-sm"><span class="sfa sfa-error-icon vertical-middle tooltip-icon"></span><div class="tooltip-inner">${data.errorText}</div></div>`
    data.el.html(errorTpl)
  },
})

Vue.filter('formatDiv', _.formatDiv)
Vue.filter('toTime', _.toTime)
Vue.filter('fixedConvert2yuan', _.fixedConvert2yuan)
Vue.filter('convert2yuan', _.convert2yuan)
