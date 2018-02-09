const TicketSelectGroup = Base.PrefabView.extend({

  options: {
    prevClass: 'js-pf',
    listClass: 'js-pf-select-ticket-list',
    levelClass: 'js-pf-select-ticket-level',
    playClass: 'js-pf-select-ticket-play',
    type: 0, // 0代表普通彩票  1代表盘口玩法
    defaultList: {
      list: {
        label: '彩种',
        value: '',
      },
      level: {
        label: '玩法群',
        value: '',
      },
      play: {
        label: '玩法',
        value: '',
      },
    },
  },

  events() {
    const events = {}

    events[`change .${this.options.listClass}`] = 'listChangeHandler'
    events[`change .${this.options.levelClass}`] = 'levelChangeHandler'

    return events
  },

  initialize() {
    // this.on('ticketList:init', this.ticketListChange);
    this.on('list:change', this.listChange)
    this.on('level:change', this.levelChange)

    this._initList()
  },

  // 获取所有彩种
  _initListXhr() {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketlist.json',
      data:{
        type: this.options.type
      }
    })
  },

  // 获取玩法群
  _initLevelXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketlevel.json',
      data,
    })
  },

  // 获取玩法
  _initPlayXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketplay.json',
      data,
    })
  },
  // 级联菜单初始化数据
  _initList() {
    const self = this

    const html = [`<option value="${this.options.defaultList.list.value}">${this.options.defaultList.list.label}</option>`]

    this._initListXhr()
      .done((res) => {
        if (res && res.result === 0) {
          self.$(`.${self.options.listClass}`).html(_(res.root).reduce((html1, ticket) => {
            html1.push(`<option value="${ticket.ticketId}">${ticket.ticketName}</option>`)
            return html1
          }, html))
        }
        // self.trigger('ticketList:init', 0);
      })

    this.$(`.${self.options.listClass}`).html(html.join(''))
    if(this.options.type === 0){
      this.$(`.${self.options.levelClass}`).html(`<option value="${this.options.defaultList.level.value}">${this.options.defaultList.level.label}</option>`)
    }
    this.$(`.${self.options.playClass}`).html(`<option value="${this.options.defaultList.play.value}">${this.options.defaultList.play.label}</option>`)
  },

  _initLevel(ticketId) {
    const self = this

    ticketId = Number(ticketId)
    const html = [`<option value="${this.options.defaultList.level.value}">${this.options.defaultList.level.label}</option>`]

    this.trigger('level:change')

    if (!_(ticketId).isNaN()) {
      this._initLevelXhr({
        ticketId,
        version: 1,
        type: this.options.type,
      })
        .done((res) => {
          if (res && res.result === 0) {
            self.$(`.${self.options.levelClass}`).html(_(res.root).reduce((html1, ticket) => {
              html1.push(`<option value="${ticket.ticketLevelId}">${ticket.ticketLevelName}</option>`)
              return html1
            }, html).join(''))
          }
        })
    }

    this.$(`.${self.options.levelClass}`).html(html.join(''))
  },

  _initPlay(ticketLevelId) {
    const self = this

    ticketLevelId = Number(ticketLevelId)

    const html = [`<option value="${this.options.defaultList.play.value}">${this.options.defaultList.play.label}</option>`]

    if (!_(ticketLevelId).isNaN()) {
      const data = {
        version:1,
        type: this.options.type,
      }
      if(this.options.type === 0){
        data.ticketLevelId = ticketLevelId
      }else{
        data.ticketId = ticketLevelId
      }
      this._initPlayXhr(data)
        .done((res) => {
          if (res && res.result === 0) {
            self.$(`.${self.options.playClass}`).html(_(res.root).reduce((html1, ticket) => {
              html1.push(`<option value="${ticket.ticketPlayId}">${ticket.ticketPlayName}</option>`)
              return html1
            }, html).join(''))
          }
        })
    }

    this.$(`.${self.options.playClass}`).html(html.join(''))
  },

  listChange(ticketId) {
    this._initLevel(ticketId)
  },

  levelChange(ticketLevelId) {
    this._initPlay(ticketLevelId)
  },

  listChangeHandler(e) {
    const $target = $(e.currentTarget)

    if(this.options.type === 0){
      if (this.$el.find(`.${this.options.levelClass}`).length) {
        this.trigger('list:change', $target.val())
      }
    }else{
      this.levelChange($target.val())
    }
  },

  levelChangeHandler(e) {
    const $target = $(e.currentTarget)

    if (this.$el.find(`.${this.options.playClass}`).length) {
      this.trigger('level:change', $target.val())
    }
  },
})

module.exports = TicketSelectGroup
