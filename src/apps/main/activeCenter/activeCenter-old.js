

import './index.scss'

const ActiveCenterView = Base.ItemView.extend({

  template: require('activeCenter/activeCenter.vue'),

  itemTpl: _(require('activeCenter/activityItem.html')).template(),

  startOnLoading: true,

  events: {},

  // 活动列表
  getActiveXhr(data) {
    return Global.sync.ajax({
      url: '/info/activitylist/getactivitylist.json',
      data,
    })
  },

  // 查看活动详细内容
  // getDetailActivityXhr: function() {},

  onRender() {
    // this.$pagination = this.$('.js-aa-pagination');
    this.$adList = this.$('.js-aa-list')

    // this.$pagination.pagination({
    //   onPaginationChange: function(index) {
    //     self.renderActiveGrid(index);
    //   }
    // });

    // this.pagination = this.$pagination.pagination('instance');

    this.renderActiveGrid(0)
  },

  renderActiveGrid(pageIndex) {
    const self = this

    // this.$adList.empty();

    this.getActiveXhr({
      // pageSize: this.pagination.option('pageSize'),
      pageIndex,
    })
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        const data = res.root || {}
        if (res && res.result === 0) {
          // self.pagination.update(data.rowCount, pageIndex);
          self.renderActive(data.activityList)
        } else {
          Global.ui.notification.show('加载失败，请稍后再试')
        }
      })
  },

  renderChunk(activityList, size) {
    const results = []
    while (activityList.length) {
      results.push(activityList.splice(0, size))
    }
    return results
  },

  renderActive(activityList) {
    const self = this
    if (_(activityList).isEmpty()) {
      this.$adList.html(this.getEmptyHtml('暂时没有活动'))
    } else {
      const html = _.map(self.renderChunk(activityList, 2), (activityRow) => {
        const items = _.map(activityRow, (activity, index) => {
          let badgeClass = ''
          switch (activity.bannerStatus) {
            case 1:
              break
            case 0:
              activity.badge = '进行中'
              badgeClass = ''
              break
            case 2:
              activity.badge = '已结束'
              badgeClass = 'ad-badge-over'
              break
            default:
              break
          }

          return this.itemTpl({
            index,
            activityId: activity.activityId,
            activityTitle: activity.activityTitle,
            bannerPicUrl: activity.bannerPicUrl,
            bannerStatus: activity.bannerStatus,
            badge: activity.badge,
            badgeClass,
            bannerUrl: activity.bannerUrl || '',
            startTime: _(activity.startTime).toDate(),
            endTime: _(activity.endTime).toDate(),
          })
        }).join('')

        return `<div class="aa-item-row">${items}</div>`
      }, this).join('')
      this.$adList.html(html)
    }
  },

  getEmptyHtml(emptyTip) {
    const html = []
    if (emptyTip) {
      html.push('<div class="js-wt-empty-container empty-container text-center">')
      html.push('<div class="empty-container-main">')
      html.push('<div class="sfa-grid-empty"></div>')
      html.push(emptyTip)
      html.push('</div>')
      html.push('</div>')
    }

    return html.join('')
  },
})

module.exports = ActiveCenterView
