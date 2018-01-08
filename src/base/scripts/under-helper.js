

const core = require('mathjs/core')

import { repeat, fill, chunk } from 'lodash'

const math = core.create()

math.import(require('mathjs/lib/function/arithmetic/add'))
math.import(require('mathjs/lib/function/arithmetic/subtract'))
math.import(require('mathjs/lib/function/arithmetic/multiply'))
math.import(require('mathjs/lib/function/arithmetic/divide'))
math.import(require('mathjs/lib/function/arithmetic/floor'))

const gameConfig = require('skeleton/misc/gameConfig')

_.mixin({
  repeat,
  fill,
  // 首字母大写
  ucFirst(string) {
    return string.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1)
    })
  },

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

  fixedConvert2yuan(money, options) {
    options = _.extend({}, {
      fixed: 3,
      clear: false,
    }, options)
    return this.convert2yuan(money, options)
  },

  convert2yuan(money, options) {
    options = _.extend({}, {
      fixed: 4,
      ratio: 10000,
      clear: true,
    }, options)

    return _.formatDiv(money, options.ratio, options)
  },

  formatDiv(money, ratio, options) {
    let format

    money = money || 0

    options = _.extend({}, {
    }, options)

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

  formatMul(money, ratio, options) {
    let format

    options = _.extend({}, {
      fixed: 0,
    }, options)

    if (!_.isUndefined(money)) {
      format = _(money).mul(ratio)

      if (options.fixed) {
        format = format.toFixed(options.fixed)
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

})
