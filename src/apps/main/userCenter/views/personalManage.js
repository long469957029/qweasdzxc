

const PersonalManageView = Base.ItemView.extend({

  startOnLoading: true,

  template: require('../templates/personalManage.html'),

  events: {
    'submit .js-uc-personalManage-form': 'updatePersonalInfoHandler',
    'click .js-uc-reset': 'resetPageHandler',
  },

  onRender() {
    const self = this
    this.$form = this.$('.js-uc-personalManage-form')
    this.$userUName = this.$('.js-uc-uName')
    this.$userUNameValRes = this.$('.js-uc-userUName-val-res')
    this.$btnConfirm = this.$('.js-uc-confirm')
    this.$bday1 = this.$('.js-bday1')
    this.$bday2 = this.$('.js-bday2')
    this.$receiver = this.$('.js-uc-receiver')
    this.$phone = this.$('.js-uc-phone')
    this.$addressDetail = this.$('.js-uc-address-detail')
    this.$province = this.$('.js-uc-province')
    this.$city = this.$('.js-uc-city')
    this.$area = this.$('.js-uc-area')

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
          // self.$('.js-uc-balance').html(_(res.root.balance).convert2yuan())
          // self.$('.js-uc-vip-level').html(`<span class="sfa mall-level-${res.root.memberLevel} level-info"></span>`)// self.levelName(res.root.memberLevel)
          // self.$('.js-uc-vip-integral').html(_(res.root.integral).formatDiv(10000))
          self.$('.js-uc-regTime').html(_(res.root.userRegTime).toTime())
          if (!_.isNull(res.root.gender)) {
            self.$(':radio[name="ucSex"]').attr('checked', res.root.gender)
          }
          // self.$('.js-uc-qqNum').val(res.root.userQq)
          // self.$('.js-uc-eMail').val(res.root.userEmail)
          const bday = res.root.userBithday
          if (bday !== null && bday !== '' && bday !== '-') {
            const _bday = bday.split('-')
            if (bday && bday.length === 2) {
              self.$bday1.val(_bday[0])
              self.$bday2.val(_bday[1])
              self.$bday1.attr('disabled', true)
              self.$bday2.attr('disabled', true)
            }
          }
          self.$receiver.val(res.root.receiverName)
          self.$phone.val(res.root.receivePhone)
          self.$addressDetail.val(res.root.receiverDetailAddr)
        } else {
          Global.ui.notification.show('获取用户个人信息失败')
        }
      })

    this.parsley = this.$form.parsley()

    window.ParsleyExtend.addAsyncValidator('checkusername', (xhr) => {
      return xhr.responseJSON.result === 0
    }, '/acct/userinfo/checkuname.json')
  },

  // levelName (level) {
  //   let levelName = ''
  //   switch (parseInt(level)) {
  //     case 0: levelName = '骑士'; break
  //     case 1: levelName = '男爵'; break
  //     case 2: levelName = '子爵'; break
  //     case 3: levelName = '伯爵'; break
  //     case 4: levelName = '侯爵'; break
  //     case 5: levelName = '公爵'; break
  //     case 6: levelName = '大公'; break
  //   }
  //   return levelName
  // },

  updatePersonalInfoHandler() {
    const self = this
    this.$btnConfirm.button('loading')
    const month = this.$bday1.val()
    const day = this.$bday2.val()

    Global.sync.ajax({
      url: '/acct/userinfo/saveuser.json',
      data: {
        userUname: this.$('.js-uc-uName').val(),
        userBirthday: (month !== '' && day !== '') ? (`${month}-${day}`) : '',
        gender: this.$(':radio[name="ucSex"]:checked').val(),
        receiverName: this.$receiver.val(),
        receiverPhone: this.$phone.val(),
        receiverDetailAddr: this.$addressDetail.val(),
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
