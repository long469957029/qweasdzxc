import axios from 'axios'
import qs from 'qs'

const CancelToken = axios.CancelToken

const SyncModule = Base.Module.extend({

  startWithParent: false,

  xhrList: [],

  login: true,

  initialize() {
    this.initAjax()
    this.initAxios()
  },

  initAjax() {
    // 备份jquery的ajax方法
    const _ajax = $.ajax

    // 重写jquery的ajax方法
    this._ajax = $.ajax = (url, options) => {
      let ajaxOptions = {}
      let prevSameXhr
      let currentXhr
      let sign

      if (typeof url === 'object') {
        ajaxOptions = url
      }

      _.defaults(ajaxOptions, {
        type: 'POST',
        abort: true,
        dataType: 'json',
        autoLogout: true,
        withoutToken: false,
      })

      _.extend(ajaxOptions, options)

      if (ajaxOptions.abort) {
        prevSameXhr = this.xhrList[ajaxOptions.url]

        // 前一个重复请求存在并且还未完成时，阻止请求
        if (prevSameXhr && prevSameXhr.cancel) {
          prevSameXhr.cancel('cancel')
        } else if (prevSameXhr && prevSameXhr.readyState !== 4) {
          prevSameXhr.abort()
        }
      }

      if (ajaxOptions.tradition) {
        _(ajaxOptions.data).each((reqData, reqName, data) => {
          if (_(reqData).isArray()) {
            _(reqData).each((val, index) => {
              if (_(val).isObject()) {
                _(val).each((value, prop) => {
                  data[`${reqName}[${index}].${prop}`] = value
                })
              } else {
                data[`${reqName}[${index}]`] = val
              }
            })

            delete data[reqName]
          }
        })
      }

      // ajaxOptions.url = 'http://forehead.5x5x.com' + ajaxOptions.url;

      if ((_.isEmpty(ajaxOptions.data) || _.isObject(ajaxOptions.data)) && _.isEmpty(ajaxOptions.files) && !ajaxOptions.withoutToken) {
        ajaxOptions.data = _.extend({
          token: Global.cookieCache.get('token'),
        }, ajaxOptions.data)
      } else if (!ajaxOptions.withoutToken) {
        ajaxOptions.url += `?token=${Global.cookieCache.get('token')}` || ''
      }

      if (ajaxOptions.localCache && ajaxOptions.cacheName) {
        sign = Global.localCache.get(ajaxOptions.cacheName)

        if (sign) {
          _.extend(ajaxOptions.data, {
            sign,
          })
        }

        if (ajaxOptions.success) {
          ajaxOptions.success = [localCacheCb, ajaxOptions.success]
        } else {
          ajaxOptions.success = localCacheCb
        }
      }

      function localCacheCb(res, textStatus, jqXhr) {
        if (res.sign && res.sign === sign) {
          _(jqXhr.responseJSON).extend(Global.localCache.get(sign))
        } else if (res && res.result === 0 && res.sign && res.root) {
          if (sign) {
            Global.localCache.clear(sign)
          }
          Global.localCache.set(ajaxOptions.cacheName, res.sign)
          Global.localCache.set(res.sign, res)
        }
      }

      currentXhr = _ajax(ajaxOptions, options)

      if (ajaxOptions.abort) {
        this.xhrList[ajaxOptions.url] = currentXhr
      }

      // 因应二号改版偷跑 先忽略验证接口的错误
      // currentXhr.fail(function (xhr, resType, type) {
      //   if (resType === 'error') {
      //     if (type === 'Unauthorized') {
      //       if (!_(ajaxOptions.data.token).isEmpty()) {
      //         this.login = false;
      //         Global.ui.notification.show('您的账户已登出,请重新登录！', {
      //           event: function () {
      //             window.location.href = 'login.html';
      //           }
      //         });
      //       } else if (ajaxOptions.autoLogout) {
      //         window.location.href = 'login.html';
      //       }
      //     } else if (xhr.status == 401) {
      //       window.location.href = 'login.html';
      //       //Global.ui.notification.show('网络不给力，请稍后再试。');
      //     }
      //   }
      // });

      if (!this.login) {
        currentXhr.abort()
      }

      return currentXhr
    }
  },

  initAxios() {
    // 备份
    const _axios = axios

    // 重写
    this._axios = (url, options) => {
      let ajaxOptions = {}
      let prevSameXhr
      let promise
      let sign

      if (typeof url === 'object') {
        ajaxOptions = url
      }

      _.defaults(ajaxOptions, {
        method: 'POST',
        abort: true,
        responseType: 'json',
        autoLogout: true,
        withoutToken: false,
        transformRequest: [function (data, headers) {
          // debugger
          return qs.stringify(data, { arrayFormat: 'brackets' })
        }],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })

      _.extend(ajaxOptions, options)

      if (ajaxOptions.abort) {
        prevSameXhr = this.xhrList[ajaxOptions.url]

        // 前一个重复请求存在并且还未完成时，阻止请求
        if (prevSameXhr && prevSameXhr.cancel) {
          prevSameXhr.cancel('cancel')
        } else if (prevSameXhr && prevSameXhr.readyState !== 4) {
          prevSameXhr.abort()
        }
      }

      if (ajaxOptions.tradition) {
        _(ajaxOptions.data).each((reqData, reqName, data) => {
          if (_(reqData).isArray()) {
            _(reqData).each((val, index) => {
              if (_(val).isObject()) {
                _(val).each((value, prop) => {
                  data[`${reqName}[${index}].${prop}`] = value
                })
              } else {
                data[`${reqName}[${index}]`] = val
              }
            })

            delete data[reqName]
          }
        })
      }

      let cancel = null
      ajaxOptions.cancelToken = new CancelToken(((c) => {
        // executor 函数接收一个 cancel 函数作为参数
        cancel = c
      }))

      if ((_.isEmpty(ajaxOptions.data) || _.isObject(ajaxOptions.data)) && _.isEmpty(ajaxOptions.files) && !ajaxOptions.withoutToken) {
        ajaxOptions.data = _.extend({
          token: Global.cookieCache.get('token'),
        }, ajaxOptions.data)
      } else if (!ajaxOptions.withoutToken) {
        ajaxOptions.url += `?token=${Global.cookieCache.get('token')}` || ''
      }

      if (ajaxOptions.localCache && ajaxOptions.cacheName) {
        sign = Global.localCache.get(ajaxOptions.cacheName)

        if (sign) {
          _.extend(ajaxOptions.data, {
            sign,
          })
        }
      }

      const localCacheCb = ({ data }) => {
        if (data.sign && data.sign === sign) {
          Object.assign(data, Global.localCache.get(sign))
        } else if (data && data.result === 0 && data.sign && data.root) {
          if (sign) {
            Global.localCache.clear(sign)
          }
          Global.localCache.set(ajaxOptions.cacheName, data.sign)
          Global.localCache.set(data.sign, data)
        }
      }

      promise = _axios(ajaxOptions, options)

      if (ajaxOptions.localCache && ajaxOptions.cacheName) {
        promise.then(localCacheCb)
      }

      if (ajaxOptions.abort) {
        this.xhrList[ajaxOptions.url] = {
          promise,
          cancel,
        }
      }

      // 因应二号改版偷跑 先忽略验证接口的错误
      // currentXhr.fail(function (xhr, resType, type) {
      //   if (resType === 'error') {
      //     if (type === 'Unauthorized') {
      //       if (!_(ajaxOptions.data.token).isEmpty()) {
      //         this.login = false;
      //         Global.ui.notification.show('您的账户已登出,请重新登录！', {
      //           event: function () {
      //             window.location.href = 'login.html';
      //           }
      //         });
      //       } else if (ajaxOptions.autoLogout) {
      //         window.location.href = 'login.html';
      //       }
      //     } else if (xhr.status == 401) {
      //       window.location.href = 'login.html';
      //       //Global.ui.notification.show('网络不给力，请稍后再试。');
      //     }
      //   }
      // });

      if (!this.login) {
        cancel()
      }

      return promise
    }
  },

  setLogout() {
    this.login = false
    Global.cookieCache.clear('token')
  },

  ajax() {
    return this._ajax.apply(this._ajax, arguments)
  },

  axios() {
    return this._axios.apply(this._axios, arguments)
  },
})

export default SyncModule
