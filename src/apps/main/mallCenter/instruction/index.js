/**
 * Created by dean on 2017/9/12.
 */

'use static'

require('./index.scss')
const footerView = require('skeleton/bases/footer')

const instructionView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-go-to': 'goToBarHandler',
  },

  getRulesXHR () {
    return Global.sync.ajax({
      url: '/mall/conf/actionConf.json',
    })
  },

  getGradeXHR () {
    return Global.sync.ajax({
      url: '/mall/conf/IntegrallevelConf.json',
    })
  },
  onRender () {
    const self = this
    self.$instruction = self.$('.instruction-footer')
    self.$instruction.html(new footerView().render().el)
    self.getRulesXHR()
      .done((data) => {
        if (data.result == 0) {
          self.creatRuleTable(data.root.result)
        }
      })
    self.getGradeXHR()
      .done((data) => {
        if (data.result == 0) {
          self.crearGradeRable(data.root.confs)
        }
      })
  },

  initialize () {
  },

  creatRuleTable (data) {
    const self = this
    _(data).map((item, index) => {
      self.$(`.js-awarding-count${index + 1}`).text(item)
    })
  },

  crearGradeRable (data) {
    const self = this
    let html = ''
    _(data).map((item, index) => {
      let text = ''
      if (_(item.discount).formatDiv(1000) == 10) {
        text = '无折扣'
      } else {
        text = `${_(item.discount).formatDiv(1000)}折`
      }
      html += `<tr><td><span class="sfa mall-level-${index}"></span></td>` +
        `<td>${_(item.integral).formatDiv(10000)}</td>` +
        `<td>${text}</td></tr>`
    })
    self.$('.js-grade-table').html(html)
  },

  goToBarHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const id = $target.data('id')
    switch (id) {
      case 1:
        self.$('.instruction-main').animate({ scrollTop: '402px' }, 400)
        break
      case 2:
        self.$('.instruction-main').animate({ scrollTop: '2640px' }, 400)
        break
      case 3:
        self.$('.instruction-main').animate({ scrollTop: '4130px' }, 400)
        break
    }
    // self.$('.instruction-main').animate({scrollTop: '860px'}, 400);


    /* var self = this;
     var t = self.$('.main-top-area').offset().top;
     alert(t)
     self.$('.main-top-area').scrollTop(30);
     var t1 = self.$('.main-top-area').offset().top;
     alert(t1) */
  },
})
module.exports = instructionView
