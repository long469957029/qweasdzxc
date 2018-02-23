import axios from 'axios'

import {shim} from 'promise.prototype.finally'
import qs from 'qs'
import urlList from './noLoginSync'
import needPostTestDataUrlConfig from './needPostTestDataUrlConfig'

shim()
const CancelToken = axios.CancelToken

const SyncModule = Base.Module.extend({

  startWithParent: false,

  xhrList: [],

  login: true,


  initialize() {
    this.initAjax()
    this.initAxios()

    Vue.prototype.$http = this._axios
    Vue.http = this._axios
    window.$http = this._axios
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
      const realToken = this.checkToken(ajaxOptions.url)
      this.checkTestAccountRequest(ajaxOptions)
      if ((_.isEmpty(ajaxOptions.data) || _.isObject(ajaxOptions.data)) && _.isEmpty(ajaxOptions.files) && !ajaxOptions.withoutToken) {
        ajaxOptions.data = _.extend({
          token: realToken,
        }, ajaxOptions.data)
      } else if (!ajaxOptions.withoutToken) {
        ajaxOptions.url += `?token=${realToken}` || ''
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
      currentXhr.fail(function (xhr, resType, type) {
        if (resType === 'error') {
          if (type === 'Unauthorized') {
            if (!_(ajaxOptions.data.token).isEmpty()) {
              this.login = false;
              Global.ui.notification.show('网络不给力，请稍后再试。', {
                event: function () {
                  // window.location.href = 'index.html';
                }
              });
            } else if (ajaxOptions.autoLogout) {
              window.store.commit(types.USER_CLEAR)
            }
          } else if (xhr.status == 401) {
            window.store.commit(types.USER_CLEAR)
          }
        }
      });
      currentXhr.success(function (xhr, resType, type) {
        if (xhr && xhr.result == -1) {
          // Global.cookieCache.clear('token')
          // Global.cookieCache.clear('loginState')
          // Global.cookieCache.clear('security')
          // window.Global.m.publish('acct:loginOut')
          // // 关闭oauth轮询监听
          // window.Global.m.oauth.stop()
          window.store.commit(types.USER_CLEAR)
          if (!window.store.getters.loginDialogStatus) {
            Global.ui.notification.show('您的账户已登出,请重新登录！', {
              event: function () {
                window.store.commit(types.TOGGLE_LOGIN_DIALOG, true)
                // window.location.href = ''
              },
              countDown: 3000
            });
          }
          // setTimeout(function(){
          //   // window.location.href = 'login.html';
          //   window.app.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
          // },3000);
        }
      });
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
      let currentXhr

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
          return qs.stringify(data, {arrayFormat: 'brackets'})
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
      const realToken = this.checkToken(ajaxOptions.url)
      this.checkTestAccountRequest(ajaxOptions)
      if ((_.isEmpty(ajaxOptions.data) || _.isObject(ajaxOptions.data)) && _.isEmpty(ajaxOptions.files) && !ajaxOptions.withoutToken) {
        ajaxOptions.data = _.extend({
          token: realToken,
        }, ajaxOptions.data)

      } else if (!ajaxOptions.withoutToken) {
        ajaxOptions.url += `?token=${realToken}` || ''

      }

      if (ajaxOptions.localCache && ajaxOptions.cacheName) {
        sign = Global.localCache.get(ajaxOptions.cacheName)

        if (sign) {
          _.extend(ajaxOptions.data, {
            sign,
          })
        }
      }

      const localCacheCb = ({data}) => {
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
      // currentXhr = _ajax(ajaxOptions, options)

      // if (ajaxOptions.abort) {
      //   this.xhrList[ajaxOptions.url] = currentXhr
      // }
      promise.catch(({message}) => {
        if (message.indexOf('401') > -1) {
          if (!window.app.$store.getters.loginDialogStatus) {
            Global.ui.notification.show('您的账户已登出,请重新登录！', {
              event: function () {
                window.app.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
              }
            });
          }
          window.store.commit(types.USER_CLEAR)
        }
      });

      if (!this.login) {
        cancel()
      }

      return promise
    }
  },

  setLogout() {
    this.login = false
    // Global.cookieCache.clear('token')
    window.app.$store.dispatch(types.DO_LOGOUT)
  },

  ajax() {
    return this._ajax.apply(this._ajax, arguments)
  },

  axios() {
    return this._axios.apply(this._axios, arguments)
  },

  checkToken(ajaxUrl) {
    let token = Global.cookieCache.get('token')
    if (!token) {// 如果抓不到token,判断是否为不需要登录的接口，如果是，则使用固定临时token
      const noLoginUrl = _(urlList.getAll()).findWhere({
        url: ajaxUrl,
      })
      if (noLoginUrl !== undefined) {
        token = window.store.state.components.universalToken
      }
    }
    return token
  },
  checkTestAccountRequest(ajaxOptions){
    if (window.Global.cookieCache.get('isTestUser')) {//
      let changeTokenUrl = _.find(needPostTestDataUrlConfig.getAll(), (item) => {
        return ajaxOptions.url.indexOf(item)>=0
      })
      if (changeTokenUrl === undefined) { //试玩账户，未特定要求的接口需要通过配置的通用token获取正式数据
        ajaxOptions.data = _.extend({
          token: window.store.state.components.universalToken,
        }, ajaxOptions.data)
      } else {
        let host = _.getDomainWithNewPrefix(window.store.state.components.testServerPrefix)
        ajaxOptions.url = host + ajaxOptions.url
      }
    }
  }
})

export default SyncModule
