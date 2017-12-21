const betRulesAlgorithm = require('bettingCenter/misc/betRulesAlgorithm')
const ticketConfig = require('skeleton/misc/ticketConfig')

const BettingCenterPlayAreaView = Base.ItemView.extend({

  template: '',

  positionTpl: _.template(require('bettingCenter/templates/bettingCenter-playArea-position.html')),

  playItemsTpl: _.template(require('bettingCenter/templates/bettingCenter-playArea-items.html')),

  missOptionTpl: _.template(require('bettingCenter/templates/bettingCenter-playArea-missOption.html')),

  events: {
    'change .js-bc-playArea-position-item': 'positionChooseHandler',
    'click .js-bc-select-item': 'selectNumberHandler',
    'click .js-bc-select-op': 'selectOperateHandler',
    'click .js-toggle-page': 'togglePageHandler',
  },

  initialize () {
    this.options.selectOptionals = []
    this.options.rowsResult = []
    this.mark6TicketIdArr = ticketConfig.getMark6TicketIdArr()
  },

  onRender() {
    const html = []
    if (this.options.page) {
      const pageCount = Math.ceil(_.div(this.options.list.length, 5))
      for (let i = 0; i < pageCount; i++) {
        const newList = []

        for (let j = (i * this.options.page); j < this.options.page * (i + 1); j++) {
          newList.push(this.options.list[j])
        }
        html.push(`<div class="jc-page-content bc-page-content js-pageIndex-${i}">${_(newList).map(function(item) {
          item.hasOp = _(item.op).some()
          return item.isShow ? this.playItemsTpl({
            limit: _(item.limits).pluck('name').join(' '),
            limitProps: _(item.limits).map((limit) => {
              return _(limit.data).map((val, prop) => {
                return `data-${ limit.name}-${ prop}="${ val}"`
              })
            }).join(' '),
            row: item,
            htmlNeedInfo: item.htmlNeedInfo,
          }) : ''
        }, this).join('')}</div>`)
      }
    } else {
      html.push(`<div class="">${_(this.options.list).map(function(item) {
        item.hasOp = _(item.op).some() // 龙虎和为全false
        return item.isShow ? this.playItemsTpl({
          limit: _(item.limits).pluck('name').join(' '),
          limitProps: _(item.limits).map((limit) => {
            return _(limit.data).map((val, prop) => {
              return `data-${ limit.name}-${ prop}="${ val}"`
            })
          }).join(' '),
          row: item,
          htmlNeedInfo: item.htmlNeedInfo,
        }) : ''
      }, this).join('')}</div>`)
    }

    this.$el.html(html.join(''))

    this.$page = this.$('.jc-page-content')

    const pageControl = '<div class="bc-page-control">' +
      '<button class="js-toggle-page bc-togglePage-btn btn m-right-md active" pageindex="0">第一名~第五名</button>' +
      '<button class="js-toggle-page bc-togglePage-btn btn" pageindex="1">第六名~第十名</button></div>'

    if (this.$page) {
      this.$('.jc-page-content:first').addClass('active')
      this.$('.jc-page-content:last').after(pageControl)
    }

    this.$playAreaPosition = this.$('.js-bc-playArea-position')
    this.$rows = this.$('.js-bc-playArea-items')

    this.calculateCoefficient()
  },

  statisticsLottery() {
    let count = 0

    this.options.rowsResult = _(this.options.list).map(function(item) {
      let selected = []

      if (item.isShow) {
        selected = _(this.$rows.filter(`.js-bc-playArea-items-${item.id}`).find('.js-bc-select-item.active')).map((itemInfo) => {
          return $(itemInfo).data('num')
        })
      }

      return selected
    }, this)

    // 如果系数不存在，根本无需计算
    if (this.options.coefficient) {
      // 任选玩法需要去掉没有选值的行，便于复选计算
      if (this.options.algorithmProps && this.options.algorithmProps.coefficient) {
        count = Math.round(_(this.options.coefficient).mul(this.options.algorithm.call(
          this.options,
          _(this.options.rowsResult).filter((rowResult) => {
            return !_.isEmpty(rowResult)
          }),
        ) || 0))
      } else {
        count = Math.round(_(this.options.coefficient).mul(this.options.algorithm.call(this.options, this.options.rowsResult) || 0))
      }
    }

    this.trigger('statistic', count)
  },

  calculateCoefficient() {
    let coefficient = 1
    const selectOptionals = []

    const $checkedList = this.$playAreaPosition.find('input[name=optional]').filter(':checked')
    const length = $checkedList.length
    if (!_.isEmpty(this.options.optionals)) {
      coefficient = betRulesAlgorithm.optional(
        this.options.optionals.coefficient,
        length,
      )
    }

    $checkedList.each((index, checked) => {
      const $checked = $(checked)
      selectOptionals.push(Number($checked.val()))
    })

    this.options.selectOptionals = selectOptionals
    this.options.coefficient = coefficient
  },

  // common APIs

  getBetting() {
    return {
      rowsResult: this.options.rowsResult,
      selectOptionals: this.options.selectOptionals,
      format: this.options.format,
      formatToNum: this.options.formatToNum || false, // PK10大小单双文字数字转换标示
      formatToNumInfo: this.options.formatToNumInfo || false, // 六合彩文字转换数值
    }
  },

  empty() {
    this.options.rowsResult = []
    this.$el.find('.js-bc-select-item,.js-bc-select-op').removeClass('active')
    this.trigger('statistic', 0)
  },

  create(createTimes) {
    let results = []
    if (this.options.coefficient) {
      results = _(createTimes).times(this.options.create, this.options)
      _(results).each(function(result) {
        result.statistics = Math.round(_(this.options.coefficient).mul(result.statistics))
        result.selectOptionals = this.options.selectOptionals
      }, this)
    }

    return results
  },

  // event handlers

  positionChooseHandler() {
    this.calculateCoefficient()
    this.statisticsLottery()
  },

  selectNumberHandler(e) {
    const $target = $(e.currentTarget)
    if (_.indexOf(this.mark6TicketIdArr, parseInt(this.options.ticketId, 10)) > -1) {
      const $itemsToolbars = $target.closest('.js-bc-playArea-items')
      this._mark6SelectNumber($target, $itemsToolbars)
    } else {
      const $parent = $target.closest('.js-bc-playArea-items')
      this._selectNumber($target, $parent)
    }
  },

  _selectNumbers($targets, $parent) {
    const self = this

    $targets.each((index, target) => {
      self._selectNumber($(target), $parent)
    })
  },

  _selectNumber($target, $parent) {
    const data = $target.data()
    const active = $target.hasClass('active')
    // const data1 = $parent.data()
    // 横向不允许冲突/超过最大选择数
    if (!active && $target.hasClass('conflict-x')) {
      if (!data.conflictXNum || data.conflictXNum === 1) {
        $target.siblings().removeClass('active')
      } else {
        const $actives = $parent.find('.js-bc-select-item.active')
        if ($actives.length >= data.conflictXNum) {
          $actives.eq(0).removeClass('active')
        }
      }
    }

    // 纵向不允许冲突
    if (!active && $target.hasClass('conflict-y')) {
      this.$rows.not($parent).find(`.js-bc-select-item[data-num=${data.num}]`).removeClass('active')
      this.$rows.not($parent).find(`.js-bc-select-item[data-num=${data.num}${data.num}]`).removeClass('active')
      this.$rows.not($parent).find(`.js-bc-select-item[data-num=${data.num % 10}]`).removeClass('active')
    }

    $target.toggleClass('active')

    $target.closest('.js-bc-playArea-items').find('.js-bc-select-op').removeClass('active')

    this.updateRowTitle($target)

    // 当是任选并且没有任选位置时，每次改变重新计算系数
    if (this.options.optionals && !this.options.optionals.list) {
      this.calculateCoefficient()
    }

    this.statisticsLottery()
  },

  updateRowTitle($target) {
    const $row = $target.closest('.js-bc-playArea-items')
    $row.find('.tab-title').toggleClass('active', !!$row.find('.js-bc-select-item').filter('.active').length)
  },

  selectOperateHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const $playArea = $target.closest('.js-bc-playArea-items')
    const $itemsToolbars = $playArea.find('.js-be-playArea-items-toolbar')
    const op = $target.data('op')
    const $items = $itemsToolbars.find('.js-bc-select-item')

    if (_.indexOf(this.mark6TicketIdArr, parseInt(this.options.ticketId, 10)) > -1) {
      if ($target.hasClass('active')) {
        $target.removeClass('active')
        $items.removeClass('active')
      } else {
        const selectEle = []
        const opid = $target.data('opid')
        const selectNum = this.options.list[0].htmlNeedInfo.groupSelectData[parseInt(opid, 10)]
        let thisColorArr = ''
        let arrStr = 'redArr'
        let weiNum = ''
        let touNum
        switch (op) {
          case 'shu': case 'niu': case 'hu': case 'tu': case '_long': case 'she':
          case 'ma': case 'yang': case 'hou': case 'ji': case 'gou': case 'zhu':
            $items.each((index, ele) => {
              const $this = $(ele)
              _(selectNum.nums).each((num) => {
                if (parseInt(num, 10) === parseInt($this.data('num'), 10)) {
                  selectEle.push($this)
                }
              })
            })
            $items.removeClass('active')
            this._selectNumbers($(selectEle), $itemsToolbars)
            break
          case 'mark6-big':
            self._selectNumbers($items.removeClass('active').filter(':gt(23)'), $itemsToolbars)
            break
          case 'mark6-small':
            self._selectNumbers($items.removeClass('active').filter(':lt(24)'), $itemsToolbars)
            break
          case 'red': case 'blue': case 'green':
            if (op === 'blue') { arrStr = 'blueArr' } else if (op === 'green') { arrStr = 'greenArr' }
            thisColorArr = this.options.list[0].htmlNeedInfo.colorArr[arrStr]
            // let selectEle = []
            $items.each((index, ele) => {
              const $this = $(ele)
              _(thisColorArr).each((num) => {
                if (parseInt(num, 10) === parseInt($this.data('num'), 10)) {
                  selectEle.push($this)
                }
              })
            })
            $items.removeClass('active')
            this._selectNumbers($(selectEle), $itemsToolbars)
            break
          case 'wei0': case 'wei1': case 'wei2': case 'wei3': case 'wei4':
          case 'wei5': case 'wei6': case 'wei7': case 'wei8': case 'wei9':
            weiNum = op.substring(op.length - 1)
            // let selectEle = []
            $items.each((index, ele) => {
              const $this = $(ele)
              const currentNum = $this.data('num').toString()
              if (currentNum.substring(currentNum.length - 1) === weiNum) {
                selectEle.push($this)
              }
            })
            $items.removeClass('active')
            this._selectNumbers($(selectEle), $itemsToolbars)
            break
          case 'tou0': case 'tou1': case 'tou2': case 'tou3': case 'tou4':
            touNum = op.substring(op.length - 1)
            // let selectEle = []
            $items.each((index, ele) => {
              const $this = $(ele)
              const currentNum = $this.data('num').toString()
              if (currentNum.substring(0, 1) === touNum) {
                selectEle.push($this)
              }
            })
            $items.removeClass('active')
            this._selectNumbers($(selectEle), $itemsToolbars)
            break
          case 'odd':
            if ($items.eq(0).data('num') % 2) {
              this._selectNumbers($items.removeClass('active').filter(':even'), $itemsToolbars)
              // $items.removeClass('active').filter(':even').trigger('click');
            } else {
              this._selectNumbers($items.removeClass('active').filter(':odd'), $itemsToolbars)
              // $items.removeClass('active').filter(':odd').trigger('click');
            }
            break
          case 'even':
            if ($items.eq(0).data('num') % 2) {
              this._selectNumbers($items.removeClass('active').filter(':odd'), $itemsToolbars)
              // $items.removeClass('active').filter(':odd').trigger('click');
            } else {
              this._selectNumbers($items.removeClass('active').filter(':even'), $itemsToolbars)
              // $items.removeClass('active').filter(':even').trigger('click');
            }
            break
          case 'clear':
            $items.removeClass('active')
            $playArea.find('.js-bc-select-op').removeClass('active')
            break
          default:
            break
        }
        $target.addClass('active')
      }
    } else {
      switch (op) {
        case 'all':
          $items.removeClass('active')
          this._selectNumbers($items, $playArea)
          // $items.removeClass('active').trigger('click');
          break
        case 'big':
          _(this.options.list).each((item) => {
            if (item.items.length === 16) {
              self._selectNumbers($items.removeClass('active').filter(':gt(7)'), $playArea)
            } else {
              self._selectNumbers($items.removeClass('active').filter(':gt(4)'), $playArea)
            }
          })
          // $items.removeClass('active').filter(':gt(4)').trigger('click');
          break
        case 'small':
          _(this.options.list).each((item) => {
            if (item.items.length === 16) {
              self._selectNumbers($items.removeClass('active').filter(':lt(8)'), $playArea)
            } else {
              self._selectNumbers($items.removeClass('active').filter(':lt(5)'), $playArea)
            }
          })
          // $items.removeClass('active').filter(':lt(5)').trigger('click');
          break
        case 'odd':
          if ($items.eq(0).data('num') % 2) {
            this._selectNumbers($items.removeClass('active').filter(':even'), $playArea)
            // $items.removeClass('active').filter(':even').trigger('click');
          } else {
            this._selectNumbers($items.removeClass('active').filter(':odd'), $playArea)
            // $items.removeClass('active').filter(':odd').trigger('click');
          }
          break
        case 'even':
          if ($items.eq(0).data('num') % 2) {
            this._selectNumbers($items.removeClass('active').filter(':odd'), $playArea)
            // $items.removeClass('active').filter(':odd').trigger('click');
          } else {
            this._selectNumbers($items.removeClass('active').filter(':even'), $playArea)
            // $items.removeClass('active').filter(':even').trigger('click');
          }
          break
        case 'clear':
          $items.removeClass('active')
          break
        default:
          break
      }
    }

    this.updateRowTitle($target)
    // $target.addClass('active').siblings().removeClass('active');

    this.statisticsLottery()
  },

  togglePageHandler(e) {
    const $target = $(e.currentTarget)
    const $targetPage = this.$page.eq($target.attr('pageindex'))
    $target.addClass('active')
    $target.siblings().removeClass('active')

    $targetPage.addClass('active')
    $targetPage.siblings().removeClass('active')
  },
  // 六合号码选择
  _mark6SelectNumber ($target, $parent) {
    // const active = $target.hasClass('active')
    $target.toggleClass('active')
    const $activeItem = $parent.find('.js-bc-select-item.active')
    if ($activeItem.length === 0) {
      $target.closest('.js-bc-playArea-items').find('.js-bc-select-op').removeClass('active')
    }
    this.updateRowTitle($target)
    // 当是任选并且没有任选位置时，每次改变重新计算系数
    if (this.options.optionals && !this.options.optionals.list) {
      this.calculateCoefficient()
    }
    this.statisticsLottery()
  },

})

module.exports = BettingCenterPlayAreaView
