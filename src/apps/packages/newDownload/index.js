

require('./index.scss')
require('packages/misc/common-init.js')

const h5linkList = [
  '手机网址 : m.hr4g.com',
  '手机网址 : m.hr5g.com',
  '手机网址 : m.hr7g.com',
  '手机网址 : m.jlp8.com',
  '手机网址 : m.yanyuan1.com',
  '手机网址 : m.yinle88.com',
]
const NewDownLoad = Base.ItemView.extend({

  template: require('./index.html'),
  events: {
    'click .js-bg-btn': 'changeBgHandler',
    'click .js-download-item': 'downloadDialogToggleHandler',
    'click .js-saomaCloseBtn': 'saomaCloseBtnHandler',
    'click .js-iphoneSaomaBtn': 'iphoneSaomaBtnHandler',
    'click .js-h5-link-btn': 'changeH5LinkHandler',
    'click .js-dialog-close': 'closeDialogHandler',
    'click .js-ag-dialog-btn': 'openAGHandler',
    'click .js-ebet-dialog-btn': 'openEBETHandler',
    'click .js-gg-dialog-btn': 'openGGHandler',
    'click .js-password-submit': 'savePasswrodHandler',
    'click .js-password-start': 'startChangePasswordHandler',
    'click .js-next': 'nextBgHandler',
    'click .js-prev': 'prevBgHandler',
  },

  initialize () {
  },

  onRender () {
    this.$downloadDialog = this.$('.js-download-dialog')
    this.$bgCtrl = this.$('.js-bg-ctrl')
    this.$bgBtnContent = this.$('.js-bg-btn-content')
    this.$bgBtn = this.$('.js-bg-btn')
    this.$bgCtrl = this.$('.js-bg-ctrl')
  },

  changeH5LinkHandler () {
    function shuffle(array) {
      let i = array.length
      let j = 0
      let temp

      while (i -= 1) { // eslint-disable-line
        j = Math.floor(Math.random() * (i + 1))

        // swap randomly chosen element with current element
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }

      return array
    }
    const index = shuffle([1, 2, 3, 4, 5, 6])[0]
    const link = h5linkList[index - 1]
    this.$bgCtrl.find('.js-h5-link').html(link)
    const classList = _.map(_.range(1, 7), (i) => {
      return `h5-qr-code-${i}`
    })
    const classes = classList.join(' ')
    this.$bgCtrl.find('.js-h5-qr-code').removeClass(classes).addClass(`h5-qr-code-${index}`)
  },

  marginLeftFun (currentTargetIndex) {
    const width = -100
    const marginLeft = `${(currentTargetIndex - 1) * width}%`
    return marginLeft
  },

  bgTransition ($target, marginLeft) {
    $target.css({ transition: 'margin-left 1s', 'margin-left': marginLeft })
  },

  iphoneImgTransition ($target, value, time) {
    time = !time ? '1s' : time
    $target.css({ transition: `opacity ${time}`, opacity: value })
  },

  nextBgHandler () {
    let pageIndex = parseInt($('.js-pageIndex').html(), 10)
    if (pageIndex === 9) {
      pageIndex = 1
    } else {
      pageIndex += 1
    }

    $('.js-pageIndex').html(pageIndex)
    $('.js-bg-btn-content').find(`.js-bg-btn:nth-child(${pageIndex})`).trigger('click')
  },

  prevBgHandler () {
    let pageIndex = parseInt($('.js-pageIndex').html(), 10)
    if (pageIndex === 1) {
      pageIndex = 9
    } else {
      pageIndex -= 1
    }
    $('.js-pageIndex').html(pageIndex)
    $('.js-bg-btn-content').find(`.js-bg-btn:nth-child(${pageIndex})`).trigger('click')
  },

  // 切换图片
  changeBgHandler (e) {
    const self = this
    const $target = $(e.currentTarget)

    if ($target.hasClass('active')) {
      return
    }
    const targetIndex = $target.index() + 1
    if (targetIndex === 5 || targetIndex === 7) { // AG
      if ($('.js-unauthorized').html() === 'true') {
        $(document).find('.js-ag-dialog-btn').addClass('hidden')
      } else {
        self.getaccountXhr({ channelId: 1 }).done((res) => {
          if (res.root === null) {
            $(document).find('.js-ag-dialog-btn').addClass('hidden')
          }
        })
      }
    } else if (targetIndex === 6) { // EBET
      if ($('.js-unauthorized').html() === 'true') {
        $(document).find('.js-ebet-dialog-btn').addClass('hidden')
      } else {
        self.getaccountXhr({ channelId: 2 }).done((res) => {
          if (res.root === null) {
            $(document).find('.js-ebet-dialog-btn').addClass('hidden')
          }
        })
      }
    } else if (targetIndex === 8) { // GG
      if ($('.js-unauthorized').html() === 'true') {
        $(document).find('.js-gg-dialog-btn').addClass('hidden')
      } else {
        self.getaccountXhr({ channelId: 6 }).done((res) => {
          if (res.root === null) {
            $(document).find('.js-gg-dialog-btn').addClass('hidden')
          }
        })
      }
    }

    $target.addClass('active').siblings().removeClass('active')
    $('.js-pageIndex').html(targetIndex)
    const marginLeft = this.marginLeftFun(targetIndex)
    this.bgTransition(this.$bgCtrl, marginLeft)
  },

  closeDialogHandler () {
    $(document).find('.js-dialog-mask').addClass('hidden')
    $(document).find('.js-password-start').removeClass('hidden')
    $(document).find('.js-password-submit').addClass('hidden')
    $(document).find('.js-warning').html('* 密码为6~12位字母或数字').addClass('hidden')
    $(document).find('.js-gameUserPassword').prop('disabled', true)
  },

  getaccountXhr (data) {
    return Global.sync.ajax({
      type: 'POST',
      url: '/info/game/userInfo.json',
      data,
    })
  },

  openAGHandler () {
    // 渠道类型：1AG，2EBET，3BBIN，4PT，5MG，6GG，7 188体育
    const self = this
    self.getaccountXhr({ channelId: 1 })
      .done((res) => {
        if (res && res.result === 0) {
          const data = res.root
          const { gameUserName, gameUserPassword } = data

          $('.js-gameUserName').val(gameUserName)
          $('.js-gameUserPassword').val(gameUserPassword)
          $('.js-dialog-mask').removeClass('hidden')
          $('.js-gameUserPassword').data('channel-id', 1)
          $('.js-dialog-title').html('AG 客户端专属账号')
        }
      })
  },

  openEBETHandler () {
    // 渠道类型：1AG，2EBET，3BBIN，4PT，5MG，6GG，7 188体育
    const self = this
    self.getaccountXhr({ channelId: 2 })
      .done((res) => {
        if (res && res.result === 0) {
          const data = res.root
          const { gameUserName, gameUserPassword } = data

          $('.js-gameUserName').val(gameUserName)
          $('.js-gameUserPassword').val(gameUserPassword)
          $('.js-dialog-mask').removeClass('hidden')
          $('.js-gameUserPassword').data('channel-id', 2)
          $('.js-dialog-title').html('Ebet 客户端专属账号')
        }
      })
  },

  openGGHandler () {
    // 渠道类型：1AG，2EBET，3BBIN，4PT，5MG，6GG，7 188体育
    const self = this
    self.getaccountXhr({ channelId: 6 })
      .done((res) => {
        if (res && res.result === 0) {
          const data = res.root
          const { gameUserName, gameUserPassword } = data

          $('.js-gameUserName').val(gameUserName)
          $('.js-gameUserPassword').val(gameUserPassword)
          $('.js-dialog-mask').removeClass('hidden')
          $('.js-gameUserPassword').data('channel-id', 6)
          $('.js-dialog-title').html('GG 客户端专属账号')
        }
      })
  },

  startChangePasswordHandler () {
    $(document).find('.js-gameUserPassword').prop('disabled', false)
    $(document).find('.js-password-start').addClass('hidden')
    $(document).find('.js-password-submit').removeClass('hidden')
    $(document).find('.js-warning').removeClass('hidden')
  },

  savePasswrodHandler (e) {
    const self = this
    const password = $(document).find('.js-gameUserPassword').val()
    const passwordReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,12}$/
    let isValidate = false
    const $target = $(e.currentTarget)

    if (password === '') {
      $(document).find('.js-warning').html('新密码不可为空')
    } else if (!passwordReg.test(password)) {
      $(document).find('.js-warning').html('您填写的密码不符合要求，请重新填写')
    } else {
      $(document).find('.js-warning').html('* 密码为6~12位字母或数字').addClass('hidden')
      isValidate = true
    }

    if (isValidate) {
      $target.button('loading')

      Global.sync.ajax({
        url: '/info/game/changePassword.json',
        data: {
          channelId: $(document).find('.js-gameUserPassword').data('channel-id'),
          password: $(document).find('.js-gameUserPassword').val(),
        },
      })
        .always(() => {
          $target.button('reset')
        })
        .done((res) => {
          if (res && res.result === 0) {
            Global.ui.notification.show('修改密码成功', {
              type: 'success',
            })
            self.closeDialogHandler()
          } else if (res.msg === 'fail' && (res.root !== null)) {
            Global.ui.notification.show(`验证失败，${res.root}`)
          } else {
            Global.ui.notification.show(`验证失败，${res.msg}`)
          }
        })
    }
  },

})

const newDownLoad = new NewDownLoad()

$(document).ready(() => {
  const { hash } = window.location
  if (hash === '#11') { // AG真人
    $('.js-bg-btn-content').find('.js-bg-btn:nth-child(5)').trigger('click')
    $('.js-pageIndex').html('5')
  } else if (hash === '#22') { // EBET真人
    $('.js-bg-btn-content').find('.js-bg-btn:nth-child(6)').trigger('click')
    $('.js-pageIndex').html('6')
  } else if (hash === '#15') { // AG 捕鱼
    $('.js-bg-btn-content').find('.js-bg-btn:nth-child(7)').trigger('click')
    $('.js-pageIndex').html('7')
  } else if (hash === '#66') { // GG 捕鱼
    $('.js-bg-btn-content').find('.js-bg-btn:nth-child(8)').trigger('click')
    $('.js-pageIndex').html('8')
  } else {
    $('.js-bg-btn-content').find('.js-bg-btn:nth-child(1)').trigger('click')
    $('.js-pageIndex').html('1')
  }
  Global.m.oauth.check({
    autoLogout: false,
  })
    .fail((xhr, resType, type) => {
      if (resType === 'error') {
        if (type === 'Unauthorized') {
          $('.js-package').html(newDownLoad.render().$el)
          $('.js-unauthorized').html('true')

          // Global.ui.notification.show('您还未登录,请登录账号！', {
          //   event: function () {
          //     window.location.href = 'login.html';
          //   }
          // });
        }
      }
    })
    .done(() => {
      $('.js-package').html(newDownLoad.render().$el)
      $('.js-unauthorized').html('false')
    })
})

