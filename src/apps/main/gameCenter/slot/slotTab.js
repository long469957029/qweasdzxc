

require('./style.scss')
const TabView = require('com/tabView')

const SlotView = require('./slotList')
// var MGSlotView = require('./MGSlot');

const SlotMachineView = TabView.extend({

  className: 'vipCredit-view',
  template: require('./slotTab.html'),

  events: {
    // 'blur .js-gc-slot-tab-input': 'debounceQuery',
    'keyup .js-gc-slot-tab-input': 'debounceQuery',
    'click .js-slot-tab-query': 'debounceQuery',
    // 'keydown .js-gc-slot-tab-input' : 'queryKewDown'
  },

  // queryKewDown: function(event){
  //   var self = this;
  //   if(event.keyCode==13){
  //     self.querySlotGameHandler();
  //   }
  // },
  debounceQuery() {
    this.throttleQuery()
  },

  querySlotGameHandler() {
    const $input = this.$('.js-gc-slot-tab-input')
    const queryString = $input.val()
    console.log(queryString)
    const $tab = this.$('.js-view-tabs')
    const $activeLi = $tab.find('li.active')
    $activeLi.removeClass('active')
    // var paneId = $activeLi.find('.js-pf-tabView-item').attr('href');//找到tab-content,对应的id
    const $tabViewContainer = this.$('.js-pf-tabView-views-container')// 找到tab-content的父节点
    let $queryResult = $tabViewContainer.find('.js-pf-tabView-query-result')// 找到查询结果展示节点
    if (queryString == '' || (this.queryString == queryString && $queryResult.hasClass('active') > 0)) {
      return // 查询内容为空，或者查询内容不变，且查询结果页面已展示，则不处理
    }
    if (this.slotView) {
      this.slotView.remove()
    }
    // if($queryResult.length==0){
    $tabViewContainer.append('<div class="js-pf-tabView-query-result tab-pane fade in active "></div>')// 未找到插入节点
    $queryResult = $tabViewContainer.find('.js-pf-tabView-query-result')// 找到查询结果展示节点
    // }else{
    //   $queryResult.toggleClass('active',true);//找到了则展示节点
    // }
    $queryResult.siblings().toggleClass('in', false).toggleClass('active', false)
    this.queryString = queryString
    this.slotView = new SlotView({ el: $queryResult, queryString })
    this.slotView.render()
  },

  slotGameListGetXhr (data) {
    return Global.sync.ajax({
      url: '/ticket/game/sublist.json',
      data,
      async: false,
    })
  },

  initialize () {
    const self = this
    _(self.options).extend({ tabs: [] })
    const channelId = 4
    this.throttleQuery = _.throttle(this.querySlotGameHandler.bind(this), 1000, true)

    this.slotGameListGetXhr({ channelId: 4, type: 3, subType: 1 }).always(() => {
      self.loadingFinish()
    })
      .done((res) => {
        if (res && res.result === 0) {
          _(res.root.channelList).each((item, index) => {
            if (item.channelId == 4 && item.status == 0) {
              self.options.tabs.push({
                label: 'PT老虎机',
                name: 'jsPTSlot',
                id: 'jsPTSlot',
                view: SlotView,
                options: { channelId: 4 },
              })
            } else if (item.channelId == 5 && item.status == 0) {
              self.options.tabs.push({
                label: 'MG老虎机',
                name: 'jsMGSlot',
                id: 'jsMGSlot',
                view: SlotView,
                options: { channelId: 5 },
              })
            }
          })
          self.options.tabs = _(self.options.tabs).sort((item) => {
            return item.options.channelId
          })

          if (self.options.tabs.length > 0) {
            self.options.tabs.push({
              label: '我的收藏',
              name: 'jsMySlot',
              id: 'jsMySlot',
              view: SlotView,
              options: { collect: 1 },
            })
          }
        } else {
          Global.ui.notification.show('获取游戏列表失败')
        }
      })
  },
})

module.exports = SlotMachineView
