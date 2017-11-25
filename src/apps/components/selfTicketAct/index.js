

const GetRedPackInfoView = require('./getRedPack')
const MyRedPackInfoView = require('./myRedPack')

const SelfTicketActView = Base.ItemView.extend({
  template: '',
  events: {
  },
  getRedPackInfoXhr () {
    return Global.sync.ajax({
      url: '/info/redpack/info.json',
    })
  },
  getMyRedPackInfoXhr (status) {
    return Global.sync.ajax({
      url: '/info/redpack/mypack.json',
      async: false,
    })
  },

  onRender() {
    const self = this
    this.subscribe('redNum', 'redNum:updating', () => {
      self.updateRedPackNum()
    })
    this.getRedPack()
    setInterval(() => {
      self.getRedPack()
    }, 20000)
    this.trigger('showMyRed:true')
  },
  getRedPack () {
    const self = this
    this.getRedPackInfoXhr()
      .done((res) => {
        if (res.result === 0) {
          // res.root.amountTotal && res.root.amountTotal > 0 ? self.trigger('showMyRed:true') : self.trigger('hideMyRed:true');
          if ((res.root.dataList && !_(res.root.dataList).isEmpty()) || (res.root.gameDataList && !_(res.root.gameDataList).isEmpty())) {
            self.showRedPackDialog(res.root.dataList[0] || res.root.gameDataList[0], 1)
          }
        }
      })
  },
  showRedPackDialog (data, type) {
    const self = this
    if (type === 1) {
      if (!this.$getRedDialog) {
        this.$getRedDialog = Global.ui.dialog.show({
          body: '<div class="js-self-ticket-main"></div>',
          anySize: '515',
          bodyClass: 'no-border no-bg',
        })
        var $selfTicketMain = this.$getRedDialog.find('.js-self-ticket-main')
        var $GetRedPackInfo = new GetRedPackInfoView({ data, parentView: this }).on('show:mypack', () => {
          self.showMyRedPack()
        }).on('update:redNum', () => {
          self.updateRedPackNum()
        })
        $selfTicketMain.html($GetRedPackInfo.render().el)

        this.$getRedDialog.on('hidden.modal', function (e) {
          $(this).remove()
          delete self.$getRedDialog
          $GetRedPackInfo.destroy()
        })
      }
    } else if (!this.$myRedDialog) {
      this.$myRedDialog = Global.ui.dialog.show({
        body: '<div class="js-self-ticket-main"></div>',
        anySize: '832',
        bodyClass: 'no-border no-bg',
      })
      var $selfTicketMain = this.$myRedDialog.find('.js-self-ticket-main')
      var $GetRedPackInfo = new MyRedPackInfoView({ data })
      $selfTicketMain.html($GetRedPackInfo.render().el)

      this.$myRedDialog.on('hidden.modal', function (e) {
        if (e.target === this) {
          $(this).remove()
          delete self.$myRedDialog
          $GetRedPackInfo.destroy()
        }
      })
    }
  },
  showMyRedPack () {
    const self = this
    this.getMyRedPackInfoXhr()
      .done((res) => {
        if (res.result === 0) {
          self.trigger('update:num', res.root.count)
          self.showRedPackDialog(res.root, 2)
        } else {
          Global.ui.notification.show(res.msg === 'fail' ? '红包信息获取失败' : res.msg)
        }
      })
      .fail((res) => {
        Global.ui.notification.show(res.msg === 'fail' ? '红包信息获取失败' : res.msg)
      })
  },
  updateRedPackNum () {
    const self = this
    self.getMyRedPackInfoXhr()
      .done((res) => {
        if (res.result === 0) {
          // if(res.root && res.root.count != 0){
          self.trigger('update:num', res.root.count)
          // }
        }
      })
  },
  checkState ($target) {
    const self = this
    let $dialog = null
    const acctInfo = Global.memoryCache.get('acctInfo')
    this.getMyRedPackInfoXhr()
      .done((res) => {
        if (res.result === 0) {
          if (res.root && res.root.count != 0) {
            $target.addClass('num').removeClass('def').html(res.root.count)
          }
          self.render()
          if (acctInfo.isFirstLoginToday) {
            $dialog = new MyRedPackInfoView({ data: res.root }) // self.showRedPackDialog(res.root,2);
          }
        }
      })
    return { $dialog, dialogParent: '.js-self-ticket-main', isShow: true }
  },
})

module.exports = SelfTicketActView
