

const PersonalManageView = Base.ItemView.extend({

  startOnLoading: true,

  template: require('../templates/personalManage.html'),

  events: {
    'submit .js-uc-personalManage-form': 'updatePersonalInfoHandler',
    'click .js-uc-reset': 'resetPageHandler',
    'click .js-uc-address-info': 'addressInfoHandler',
    'click .js-head-icon-info': 'headIconHandler',
  },

  getHeadIconXhr() {
    return Global.sync.ajax({
      url: '/acct/userinfo/headIconList.json',
    })
  },
  getCityListXhr() {
    return Global.sync.ajax({
      url: '/info/city/list.json',
    })
  },
  getProvinceXhr() {
    return Global.sync.ajax({
      url: '/info/city/provincelist.json',
    })
  },
  getCityXhr(data) {
    return Global.sync.ajax({
      url: '/info/city/citylist.json',
      data,
    })
  },
  getAreaXhr(data) {
    return Global.sync.ajax({
      url: '/info/city/areaList.json',
      data,
    })
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
    this.$provinceList = this.$('.js-province-list')
    this.$city = this.$('.js-uc-city')
    this.$cityList = this.$('.js-city-list')
    this.$area = this.$('.js-uc-area')
    this.$areaList = this.$('.js-area-list')
    this.$headIconList = this.$('.js-uc-head-icon-list')

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
          self.iconId = res.root.headIconId
          self.$('.js-uc-regTime').html(_(res.root.userRegTime).toTime())
          if (!_.isNull(res.root.gender)) {
            self.$(':radio[name="ucSex"]').attr('checked', res.root.gender)
          }
          const bday = res.root.userBithday
          if (bday !== null && bday !== '' && bday !== '-') {
            const _bday = bday.split('-')
            if (_bday && _bday.length === 2) {
              self.$bday1.val(_bday[0])
              self.$bday2.val(_bday[1])
              self.$bday1.attr('disabled', true)
              self.$bday2.attr('disabled', true)
            }
          }
          self.$receiver.val(res.root.receiverData.receiverName)
          self.$phone.val(res.root.receiverData.receivePhone)
          self.$addressDetail.val(res.root.receiverData.receiverDetailAddr)
          self.getHeadIconXhr()
            .done((_res) => {
              if (_res && _res.result === 0) {
                if (_res.root && _res.root.records) {
                  self.formateHeadIconList(_res.root.records)
                }
              }
            })
          self.getCityListXhr()
            .done((resp) => {
              if (resp && resp.result === 0) {
                if (resp.root) {
                  self.cityList = resp.root
                  console.log(self.cityList)
                  // self.formateProvinceList(resp.root, 1)
                }
              }
            })
        } else {
          Global.ui.notification.show('获取用户个人信息失败')
        }
      })

    this.parsley = this.$form.parsley()

    window.ParsleyExtend.addAsyncValidator('checkusername', (xhr) => {
      return xhr.responseJSON.result === 0
    }, '/acct/userinfo/checkuname.json')
  },

  formateHeadIconList(data) {
    if (data) {
      this.$headIconList.empty()
      _(data).each((item) => {
        this.$headIconList.append(`<li class="icon-info js-head-icon-info ${item.id === this.iconId ? 'active' : ''}" data-id="${item.id}"><img src="${item.url}" class="head-img"></li>`)
      })
    }
  },
  formateProvinceList(data, type) {
    if (data) {
      let list = ''
      if (type === 1) {
        _(data).each((item) => {
          list += `<li class="list-info js-uc-address-info" data-id="${item.provinceId}" data-type="${type}">${item.province}</li>`
        })
        this.$provinceList.html(list)
      } else if (type === 2) {
        _(data).each((item) => {
          list += `<li class="list-info js-uc-address-info" data-id="${item.cityId}" data-type="${type}">${item.city}</li>`
        })
        this.$cityList.html(list)
      } else {
        list = '<div class="text-red m-bottom-sm p-left-sm">*若找不到对应的区县项请选择“其他”，然后再详细地址处再完善</div>'
        _(data).each((item) => {
          list += `<li class="list-info js-uc-address-info" data-id="${item.areaId}" data-type="${type}">${item.area}</li>`
        })
        list += `<li class="list-info js-uc-address-info text-red" data-id="99999" data-type="${type}">其他</li>`
        this.$areaList.html(list)
      }
    }
  },
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
        receiverCityId: this.$province.data('id'),
        receiverProvinceId: this.$city.data('id'),
        receiverAreaId: this.$area.data('id'),
        headIconId: this.iconId,
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
  addressInfoHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const id = $target.data('id')
    const name = $target.html()
    const type = $target.data('type') // 1表示省 2表示市 3表示区
    if (type === 1) {
      this.$province.attr('data-id', id).html(name)
      this.$city.removeAttr('data-id').html('市')
      this.$area.removeAttr('data-id').html('区')
      this.getCityXhr({ province: name })
        .done((res) => {
          if (res && res.result === 0) {
            if (res.root) {
              self.formateProvinceList(res.root, 2)
            }
          }
        })
        .fail((res) => {
          Global.ui.notification.show(res.msg === 'fail' ? '获取城市列表失败' : res.msg)
        })
    } else if (type === 2) {
      this.$city.attr('data-id', id).html(name)
      this.$area.removeAttr('data-id').html('区')
      this.getAreaXhr({ cityId: id })
        .done((res) => {
          if (res && res.result === 0) {
            if (res.root) {
              self.formateProvinceList(res.root, 3)
            }
          }
        })
        .fail((res) => {
          Global.ui.notification.show(res.msg === 'fail' ? '获取城市列表失败' : res.msg)
        })
    } else if (type === 3) {
      this.$area.attr('data-id', id).html(name)
    }
  },
  headIconHandler(e) {
    const $target = $(e.currentTarget)
    $target.addClass('active').siblings().removeClass('active')
    this.iconId = $target.data('id')
  },
})

module.exports = PersonalManageView
