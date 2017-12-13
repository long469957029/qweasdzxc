

const PersonalManageView = Base.ItemView.extend({

  startOnLoading: true,

  events: {
    'submit .js-uc-personalManage-form': 'updatePersonalInfoHandler',
    'click .js-uc-reset': 'resetPageHandler',
  },

  onRender() {
    const self = this

    Global.sync.ajax({
      url: '/acct/userinfo/userdetail.json',
      data: {},
    })
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res && res.result === 0) {
          self.$('.js-uc-userName').html(res.root.userName)
          self.$('.js-uc-uName').val(res.root.uName)
          self.$('.js-uc-balance').html(_(res.root.balance).convert2yuan())
          self.$('.js-uc-vip-level').html(`<span class="sfa mall-level-${res.root.memberLevel} level-info"></span>`)// self.levelName(res.root.memberLevel)
          self.$('.js-uc-vip-integral').html(_(res.root.integral).formatDiv(10000))
          self.$('.js-uc-regTime').html(_(res.root.userRegTime).toTime())
          self.$('.js-uc-qqNum').val(res.root.userQq)
          self.$('.js-uc-eMail').val(res.root.userEmail)
          let bday = res.root.userBithday
          if (bday !== null && bday !== '' && bday !== '-') {
            bday = bday.split('-')
            if (bday && bday.length === 2) {
              self.$('.js-bday1').val(bday[0])
              self.$('.js-bday2').val(bday[1])
              self.$('.js-bday1').attr('disabled', true)
              self.$('.js-bday2').attr('disabled', true)
            }
          }
        } else {
          Global.ui.notification.show('获取用户个人信息失败')
        }
      })

    this.$form = this.$('.js-uc-personalManage-form')
    this.$userUName = this.$('.js-uc-uName')
    this.$userUNameValRes = this.$('.js-uc-userUName-val-res')
    this.$btnConfirm = this.$('.js-uc-confirm')

    this.parsley = this.$form.parsley()

    window.ParsleyExtend.addAsyncValidator('checkusername', (xhr) => {
      return xhr.responseJSON.result === 0
    }, '/acct/userinfo/checkuname.json')
  },

  levelName (level) {
    let levelName = ''
    switch (parseInt(level, 10)) {
      case 0: levelName = '骑士'; break
      case 1: levelName = '男爵'; break
      case 2: levelName = '子爵'; break
      case 3: levelName = '伯爵'; break
      case 4: levelName = '侯爵'; break
      case 5: levelName = '公爵'; break
      case 6: levelName = '大公'; break
      default:
        break
    }
    return levelName
  },

  updatePersonalInfoHandler() {
    const self = this
    this.$btnConfirm.button('loading')
    const month = this.$('.js-bday1').val()
    const day = this.$('.js-bday2').val()

    Global.sync.ajax({
      url: '/acct/userinfo/saveuser.json',
      data: {
        userQqNum: this.$('.js-uc-qqNum').val(),
        userEmail: this.$('.js-uc-eMail').val(),
        userUname: this.$('.js-uc-uName').val(),
        userBirthday: (month !== '' && day !== '') ? (`${month}-${day}`) : '',
      },
    })
      .always(() => {
        self.$btnConfirm.button('reset')
      })
      .done((res) => {
        if (res && res.result === 0) {
          Global.ui.notification.show('修改个人信息成功', {
            type: 'success',
          })
        } else {
          Global.ui.notification.show('修改个人信息失败')
        }
      })
  },
})

module.exports = PersonalManageView
