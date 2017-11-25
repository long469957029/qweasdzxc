

require('./../misc/common.js')
require('./index.scss')
require('./jquery.FontScroll.js')

const config = require('./config')

$.widget('gl.baseTasks', {

  template: require('./index.html'),

  getTasksXhr(data) {
    return Global.sync.ajax({
      url: '/info/task/status.json',
      data,
    })
  },

  getWinnerListXhr() {
    return Global.sync.ajax({
      url: '/info/task/list.json',
      data: {
        pageSize: 30,
      },
    })
  },

  finishTaskXhr(data) {
    return Global.sync.ajax({
      url: '/info/task/get.json',
      data,
    })
  },

  _create() {
    const self = this

    this.tasks = config.getAll()

    this.element.html(_(this.template).template()({
      tasks: this.tasks,
    }))

    this.$complete = this.element.find('.js-completeTotal')
    this.$taskTotal = this.element.find('.js-taskTotal')
    this.$goldTotal = this.element.find('.js-goldTotal')
    this.$winners = this.element.find('#jsWinnerList')

    this.$ele = this.element.find('.ele_lump li')
    this.$successBtn = this.element.find('.success_btn')

    self.getTasksXhr()
      .done((res) => {
        if (res && res.result === 0) {
          self.renderContent(res.root || {})
        }
      })
    setInterval(() => {
      self.getTasksXhr()
        .done((res) => {
          if (res && res.result === 0) {
            self.renderContent(res.root || {})
          }
        })
    }, 3000)

    this.getWinnerListXhr()
      .done((res) => {
        if (res && res.result === 0) {
          self.$winners.html(`<ul>${_(res.root).map((content) => {
            return `<li>${ content}</li>`
          }).join('')}</ul>`)

          self.$winners.FontScroll({
            time: 2000,
            num: 1,
          })
        }
      })


    const init_width = $(document).width()
    const init_height = $(document).height()
    const $container = this.element.find('.container')
    
    $container.css('width', init_width)
    $container.css('height', init_height)

    const $notice_lump = this.element.find('.notice_lump')
    $notice_lump.css('top', 180)
    $notice_lump.css('left', (init_width / 2 - ($notice_lump.width() / 2)))

    this.$successBtn.css('top', 470)
    this.$successBtn.css('left', (init_width / 2 - (this.$successBtn.width() / 2)))

    const $title_lump = this.element.find('.title_lump')
    $title_lump.css('top', ($title_lump.width() / 7))
    $title_lump.css('left', (init_width / 2 - ($title_lump.width() / 2)))

    const $bar_lump = this.element.find('.bar_lump')
    $bar_lump.css('top', ($bar_lump.width() / 3.4))
    $bar_lump.css('left', (init_width / 2 - ($bar_lump.width() / 2)))

    const $border_explain = this.element.find('.border_explain')
    $border_explain.css('top', 200)
    $border_explain.css('left', (init_width / 2 - ($border_explain.width() / 2)))

    const $border_mission = this.element.find('.border_mission')
    $border_mission.css('top', 200)
    $border_mission.css('left', (init_width / 2 - ($border_mission.width() / 2)))

    const $close_btn = this.element.find('.close_btn')
    $close_btn.click(function() {
      $(this).parent().hide()
    })

    const $explain = this.element.find('.explain')
    const $mission = this.element.find('.mission')

    $explain.click(() => {
      $border_explain.show()
    })
    $mission.click(() => {
      $border_mission.show()
    })

    this.$ele.mouseover(function() {
      if ($border_explain.is(':hidden') && $border_mission.is(':hidden')) {
        $notice_lump.show()
        $notice_lump.text($(this).find('.notice_text').text())
      }
    }).mouseout(() => {
      $notice_lump.hide()
      $notice_lump.text('')
    })

    this._on({
      'click .js-finish-task': 'finishHandler',
    })
  },

  renderContent(data) {
    let completeTotal = 0
    let find
    for (let i = 0; i < this.tasks.length; ++i) {
      find = _(data.completeList).findWhere({
        taskId: this.tasks[i].id,
      })
      if (find) {
        ++completeTotal
        if (find.getStatus === 1) {
        } else {
          break
        }
      } else {
        break
      }
    }

    this.$complete.text(completeTotal)
    this.$taskTotal.text(data.taskTotal)
    this.$goldTotal.text(data.goldTotal)

    // this.updateStage(0);
    this.updateStage(
      completeTotal,
      find && find.getStatus,
    )
  },

  updateStage(completeCount, hasReceive) {
    let i
    this.$complete.text(completeCount)

    for (i = 0; i < completeCount; ++i) {
      this.$ele.eq(i).find('.gray').hide()
    }

    if (completeCount > 0 && hasReceive === 0) {
      this.$ele.eq(completeCount - 1).find('.task-btn').show()
    }
  },

  finishHandler(e) {
    const self = this
    const $target = $(e.currentTarget)

    this.finishTaskXhr({
      taskId: $target.data('id'),
    })
      .done((res) => {
        if (res && res.result === 0) {
          $target.hide()

          self.$successBtn.css('display', 'block')
          self.$successBtn.animate({
            opacity: '1',
            top: '-=50px',
          }, 300, () => {
            self.$successBtn.delay(200).animate({
              opacity: '0',
              top: '-=50px',
            }, 300, () => {
              self.$successBtn.css('display', 'none')
            })
          })
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
  },
})

$(document).ready(() => {
  Global.m.oauth.check({
    autoLogout: false,
  }).fail((xhr, resType, type) => {
    if (resType === 'error') {
      if (type === 'Unauthorized') {
        Global.ui.notification.show('您还未登录,请登录账号！', {
          event () {
            window.location.href = 'login.html'
          },
        })
      }
    }
  })
    .done(() => {
      $('.js-package').baseTasks()
    })
})
