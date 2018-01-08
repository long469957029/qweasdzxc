
import { getRouter, menuConfig } from 'skeleton/misc/menuConfig' // eslint-disable-line

const dividendConfig = require('agencyCenter/dividendManage/dividendConfig')


const SidemenuModule = Base.Module.extend({

  startWithParent: false,

  menuConfig,

  onStart() {
    _.bindAll(this, 'updateMenuAuth')

    Global.m.subscribe('acct', 'acct:updating', this.updateMenuAuth)
  },

  updateMenuAuth(acctInfo) {
    // dividendStatus 分红状态
    const dividendStatus = acctInfo.dividendStatus !== dividendConfig.getByName('UN_APPLIED').id
    // $('.js-header-router-role[href="#ac/dm"]').toggleClass('hidden', !dividendStatus && !acctInfo.merchant)// header菜单显示权限处理
    // $('.js-header-router-role[href="#ac/rp"]').toggleClass('hidden', !acctInfo.redEnvelope)// header菜单显示权限处理
    // $('.js-header-router-role[href="#ac/reb"]').toggleClass('hidden', !acctInfo.merchant)// header菜单显示权限处理
    $('.js-dm-tip').toggleClass('hidden', acctInfo.dividendStatus === 1)
    _(_(this.get('ac').sub).chain().pluck('list').flatten()
      .value()).findWhere({
      id: 407, // 直属分红
    }).auth = dividendStatus || acctInfo.merchant
    _(_(this.get('ac').sub).chain().pluck('list').flatten()
      .value()).findWhere({
      id: 501, // 直属分红 - 下级分红
    }).auth = dividendStatus || !acctInfo.merchant
    _(_(this.get('ac').sub).chain().pluck('list').flatten()
      .value()).findWhere({
      id: 502, // 直属分红
    }).auth = dividendStatus || !acctInfo.merchant

    _(_(this.get('ac').sub).chain().pluck('list').flatten()
      .value()).findWhere({
      id: 408, // 红包
    }).auth = acctInfo.redEnvelope// f

    _(_(this.get('ac').sub).chain().pluck('list').flatten()
      .value()).findWhere({
      id: 409, // 返点
    }).auth = acctInfo.merchant// t
  },

  getAll() {
    return this.menuConfig
  },
  getNav() {
    return _(this.menuConfig).filter((item) => {
      return item.notNav !== true
    })
  },

  get(router) {
    // return _(this.menuConfig).findWhere({
    //   router,
    // })
    return getRouter(router)
  },

  selectMenuFromCurrentHash() {
    this.selectMenu(window.location.hash)
    // Global.entryRegin.currentView.updateQuickEntry(window.location.hash);
  },

  selectMenu(hash) {
    if (!hash) {
      hash = '#'
    }

    const $mainMenu = $('.js-gl-main-navbar')

    $mainMenu.find('ul li').each((index, li) => {
      const $li = $(li)
      if ($li.data('router') === '') {
        if (hash.indexOf('?') === 1 || hash === '#') {
          $li.addClass('active')
        } else {
          $li.removeClass('active')
        }
      } else if (hash.indexOf($li.data('router')) === 1) {
        $li.addClass('active')
      } else {
        $li.removeClass('active')
      }
    })
  },
})

module.exports = SidemenuModule
