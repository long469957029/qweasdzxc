const avatarCfg = require('../misc/avatarConfig')

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
      type: 'GET',
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
    this.$addressListError = this.$('.js-address-list-error')

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
            self.$(`input[name="ucSex"][value=${res.root.gender}]`).attr('checked', true)
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
          self.$receiver.val(_.isNull(res.root.receiverData) ? '' : res.root.receiverData.receiverName)
          self.$phone.val(_.isNull(res.root.receiverData) ? '' : res.root.receiverData.receivePhone)
          self.$addressDetail.val(_.isNull(res.root.receiverData) ? '' : res.root.receiverData.receiverDetailAddr)
          self.formateHeadIconList(avatarCfg.avatars)
          self.getCityListXhr()
            .done((resp) => {
              if (resp && resp.result === 0) {
                if (resp.root) {
                  self.cityList = resp.root
                  self.formateProvinceList(resp.root, 1)
                  if (!_.isNull(res.root.receiverData)) {
                    self.formateHasChooseCityList(res.root.receiverData)
                  }
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
    if ('LIST:' + data) {
      const self = this
      this.$headIconList.empty()
      const html = _(data).map((item) => {
        return `<li class="icon-info js-head-icon-info ${Number(item.id) === self.iconId ? 'active' : ''}" 
            data-id="${item.id}"><img src="${item.logo}" class="head-img"></li>`
      })
      this.$headIconList.html(html.join(''))
    }
  },
  formateHasChooseCityList(data) {
    const pInfo = _(this.cityList).findWhere({provinceId: data.receiverProvinceId})
    const pName = pInfo.province
    const cInfo = _(pInfo.cityList).findWhere({cityId: data.receiverCityId})
    const cName = cInfo.city
    let aName = ''
    if (data.receiverAreaId === 99999) {
      aName = '其他'
    } else {
      const aInfo = _(cInfo.areaList).findWhere({areaId: data.receiverAreaId})
      aName = aInfo.area
    }
    this.$province.attr('data-id', data.receiverProvinceId).html(pName)
    this.$city.attr('data-id', data.receiverCityId).html(cName)
    this.$area.attr('data-id', data.receiverAreaId).html(aName)
    this.chooseProvince = pInfo.cityList
    this.formateProvinceList(this.cityList, 1)
    this.formateProvinceList(pInfo.cityList, 2)
    this.formateProvinceList(cInfo.areaList, 3)
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
    if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
      Global.ui.notification.show('试玩会员无法进行修改个人资料操作，请先注册正式游戏账号')
      return false
    }
    const self = this
    const month = this.$bday1.val()
    const day = this.$bday2.val()
    const pid = this.$province.data('id')
    const cid = this.$city.data('id')
    const aid = this.$area.data('id')
    if (_.isUndefined(pid) || _.isUndefined(cid) || _.isUndefined(aid)) {
      const data = {
        el: this.$addressListError,
        errorText: '*请选择正确的省市区',
      }
      this.formateError(data)
      return false
    }
    this.$btnConfirm.button('loading')
    Global.sync.ajax({
      url: '/acct/userinfo/saveuser.json',
      data: {
        userUname: this.$('.js-uc-uName').val(),
        userBirthday: (month !== '' && day !== '') ? (`${month}-${day}`) : '',
        gender: this.$(':radio[name="ucSex"]:checked').val(),
        receiverName: this.$receiver.val(),
        receiverPhone: this.$phone.val(),
        receiverDetailAddr: this.$addressDetail.val(),
        receiverCityId: cid,
        receiverProvinceId: pid,
        receiverAreaId: aid,
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

          window.app.$store.dispatch(types.CHECK_LOGIN_STATUS)
        } else {
          Global.ui.notification.show('修改个人信息失败')
        }
      })
  },
  addressInfoHandler(e) {
    const $target = $(e.currentTarget)
    const id = $target.data('id')
    const name = $target.html()
    const type = $target.data('type') // 1表示省 2表示市 3表示区
    if (type === 1) {
      this.$province.attr('data-id', id).html(name)
      this.$city.removeAttr('data-id').html('市')
      this.$area.removeAttr('data-id').html('区')
      this.chooseProvince = _(this.cityList).findWhere({provinceId: id}).cityList
      this.formateProvinceList(this.chooseProvince, 2)
    } else if (type === 2) {
      this.$city.attr('data-id', id).html(name)
      this.$area.removeAttr('data-id').html('区')
      const areaInfo = _(this.chooseProvince).findWhere({cityId: id}).areaList
      this.formateProvinceList(areaInfo, 3)
    } else if (type === 3) {
      this.$area.attr('data-id', id).html(name)
    }
  },
  headIconHandler(e) {
    const $target = $(e.currentTarget)
    $target.addClass('active').siblings().removeClass('active')
    this.iconId = $target.data('id')
  },
  formateError(data) {
    const errorTpl = `<span class="text-hot"><i class="sfa sfa-error-icon m-right-xs vertical-middle"></i>${data.errorText}</span>`
    data.el.html(errorTpl)
  },
})

module.exports = PersonalManageView
