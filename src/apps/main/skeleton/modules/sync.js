

const SyncModule = Base.Module.extend({

  startWithParent: false,

  xhrList: [],

  login: true,

  initialize () {
    const self = this
    // 备份jquery的ajax方法
    const _ajax = $.ajax

    // 重写jquery的ajax方法
    this._ajax = $.ajax = function (url, options) {
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
        prevSameXhr = self.xhrList[ajaxOptions.url]

        // 前一个重复请求存在并且还未完成时，阻止请求
        if (prevSameXhr && prevSameXhr.readyState !== 4) {
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
        self.xhrList[ajaxOptions.url] = currentXhr
      }

      // 因应二号改版偷跑 先忽略验证接口的错误
      // currentXhr.fail(function (xhr, resType, type) {
      //   if (resType === 'error') {
      //     if (type === 'Unauthorized') {
      //       if (!_(ajaxOptions.data.token).isEmpty()) {
      //         self.login = false;
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

      if (!self.login) {
        currentXhr.abort()
      }

      return currentXhr
    }
  },

  setLogout () {
    this.login = false
    Global.cookieCache.clear('token')
  },

  ajax () {
    return this._ajax.apply(this._ajax, arguments)
  },
})

module.exports = SyncModule
