// var servers = require('skeleton/misc/servers');

require('./index.scss')
require('./../misc/common-init.js')

const AnimateBg = require('../../components/animateBg')
const FooterView = require('../../components/footer')
const HeaderView = require('../../components/header')
const LoadingView = require('../../components/loading')

$.widget('gl.changeUrl', {

  template: require('./index.html'),

  getServerListXhr () {
    return Global.sync.ajax({
      url: '/info/urls/list.json',
    })
  },

  getNewsListXhr () {
    return Global.sync.ajax({
      url: '/info/activitylist/publist.json',
      data: {
        pageSize: 8,
        pageIndex: 0,
      },
    })
  },


  _create () {
    const self = this
    this.element.html(_(this.template).template()({
      time: moment().format('M月DD日 ddd'),
      remember: Global.localCache.get('account.remember'),
    }))
    $('#jsDbCarouselChangeUrl').carousel({
      interval: 5000,
    })

    // this._newsShow();//页面都没这个功能，怎么还在请求
    this._connectTest()

    // 页首页尾背景
    this.$header = this.element.find('.js-header')
    this.$footer = this.element.find('.js-footer')
    this.$bg = this.element.find('.js-bg')
    this.$loading = this.element.find('.js-loading')

    new LoadingView({
      el: this.$loading,
      season: 'fall', // 根据季节变换背景
    }).render()
    new AnimateBg({
      el: this.$bg,
      season: 'fall', // 根据季节变换背景
    }).render()
    new HeaderView({
      el: this.$header,
      hasCollect: true, // 加到最爱
    }).render()
    new FooterView({
      el: this.$footer,
    }).render()

    $('.js-refresh').on('click', () => {
      $('.js-cu-List').empty()
      self._connectTest()
    })

    this._onPageLoaded()

    $('.js-collect').on('click', () => {
      const url = window.location.href
      const title = document.title
      const ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL'

      if (window.sidebar) { // firefox;
        alert(`您正在使用的浏览器可以尝试通过快捷键${ctrl} + D 加入到收藏夹~`)
      } else if (document.all) { // document.all 用于低版本的IE
        window.external.addFavorite(url, title)
      } else {　// 添加收藏的快捷键
        alert(`您正在使用的浏览器可以尝试通过快捷键${ctrl} + D 加入到收藏夹~`)
      }
    })
  },

  _onPageLoaded () {
    setTimeout(() => {
      $('.js-loading').addClass('hidden')
    }, 1500)
  },

  _connectTest () {
    const self = this
    const showIndex = 0
    const linList = []

    this.getServerListXhr()
      .always(() => {
      })
      .done((res) => {
        if (res.result === 0) {
          const servers = res.root

          const defer = $.Deferred()
            .done(() => {
              self.append(linList)
            })

          let contentCount = 0

          _(servers).each((serverInfo, index, list) => {
            const start = Date.now()
            serverInfo = (serverInfo.indexOf('http://') > -1 || serverInfo.indexOf('https://') > -1) ? serverInfo : `http://${serverInfo}`
            $.ajax({
              url: `${serverInfo}/connect-test.json`,
              dataType: 'jsonp',
              jsonpCallback: 'abc',
              timeout: 2000,
            })
              .always((res) => {
                // self.element.find('.js-connect-server-' + index).addClass('connect-speeds-tested connect-speeds-' + Math.floor((Date.now() - start) / 200));
                const serverAddress = serverInfo
                const timems = Math.floor((Date.now() - start))
                linList.push({ time: timems, server: serverAddress })
                if (++contentCount === list.length) {
                  defer.resolve()
                }
              })
          })
        } else {
          Global.ui.notification.show('数据请求失败')
        }
      })
  },

  append (linList) {
    linList.sort((a, b) => {
      return (a.time > b.time) ? 1 : -1
    })

    this._cuListAppend(linList)
  },

  _cuListAppend (linList) {
    let html = ''
    _(linList).each((info, index) => {
      let text = ''
      let className = ''
      if (info.time > 200 && info.time <= 700) {
        className = 'yellow'
      } else if (info.time > 700) {
        className = 'red'
      } else {
        className = 'green'
      }

      if (index === 0) {
        text = '推荐进入'
      } else {
        text = '立即进入'
      }

      html += (
        `${'<li>' +
        '<div class="time">' +
        '<span class="light '}${className}"></span>` +
        `<span class="timems">${info.time}ms</span>` +
        '</div>' +
        `<div class="url">${info.server}</div>` +
        `<div class="link"><a href="${info.server}">${text}</a></div>` +
        '</li>'
      )
    })
    $('.js-cu-List').html(html)
  },
  _newsShow () {
    const self = this
    let html = ''

    this.getNewsListXhr()
      .done((res) => {
        if (res.result === 0) {
          const newsList = res.root.buList

          $.each(newsList, (index) => {
            if (index < 5) {
              html += (`${'<li>' +
                '<span class="news">'}${newsList[index].title}</span>` +
                `<span class="date">${_(newsList[index].time).toDate('MM/DD')}</span>` +
                '</li>')
            }
            return html
          })
        }
        $('.js-news-List').html(html)
      })
  },

})

$(document).ready(() => {
  new LoadingView({
    el: $('.js-package'),
  }).render()
  setTimeout(() => {
    $('.js-package').changeUrl()
  }, 500)
})
