import axios from 'axios'
import qs from 'qs'
import urlList from './noLoginSync'

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

      if ((_.isEmpty(ajaxOptions.data) || _.isObject(ajaxOptions.data)) && _.isEmpty(ajaxOptions.files) && !ajaxOptions.withoutToken) {
        const realToken = this.checkToken(ajaxOptions.url)
        ajaxOptions.data = _.extend({
          token: realToken,
        }, ajaxOptions.data)
      } else if (!ajaxOptions.withoutToken) {
        const realToken = this.checkToken(ajaxOptions.url)
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
            }
          } else if (xhr.status == 401) {
          }
        }
      });
      currentXhr.success(function (xhr, resType, type) {
        if(xhr && xhr.result==-1){
          // Global.cookieCache.clear('token')
          // Global.cookieCache.clear('loginState')
          // Global.cookieCache.clear('security')
          // window.Global.m.publish('acct:loginOut')
          // // 关闭oauth轮询监听
          // window.Global.m.oauth.stop()
          Global.ui.notification.show('您的账户已登出,请重新登录！', {
            event: function () {
              window.app.$store.commit(types.USER_CLEAR)
              window.app.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
            },
            countDown: 3000
          });
          setTimeout(function(){
            // window.location.href = 'login.html';
            window.app.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
          },3000);
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

      if ((_.isEmpty(ajaxOptions.data) || _.isObject(ajaxOptions.data)) && _.isEmpty(ajaxOptions.files) && !ajaxOptions.withoutToken) {
        const realToken = this.checkToken(ajaxOptions.url)
        ajaxOptions.data = _.extend({
          token: realToken,
        }, ajaxOptions.data)
      } else if (!ajaxOptions.withoutToken) {
        const realToken = this.checkToken(ajaxOptions.url)
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
      promise.catch(function (xhr, resType, type) {
        if (xhr.response.status === 401 || xhr.response.statusText==='Unauthorized') {
          window.app.$store.commit(types.USER_CLEAR)
          Global.ui.notification.show('您的账户已登出,请重新登录！', {
            event: function () {
              // window.location.href = 'index.html';
              // window.app.$store.dispatch(types.DO_LOGOUT)
              window.app.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
            }
          });
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
    const noLoginUrl = _(urlList.getAll()).findWhere({
      url: ajaxUrl,
    })
    let token = Global.cookieCache.get('token')
    if (noLoginUrl !== undefined && token === null) { // 如果抓不到token,使用固定临时token
      token = '000-000-000-000-player125'
    }
    return token
  },
})

export default SyncModule
