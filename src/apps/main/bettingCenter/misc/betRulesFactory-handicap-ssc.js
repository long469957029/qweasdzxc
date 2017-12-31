import betFormat from './betFormat'
import factory from 'bettingCenter/misc/betRulesFactory'
import { chunk } from 'lodash'

const fortyNine = _.range(1, 50)

const getFortyNine = () => {
  return _.map(fortyNine, (num, index) => {
    num = `${(num % 10) - 1 + (100 * Math.ceil(index / 10))}`
    return {
      num,
      title: (num % 10),
      style: 'gray circle',
    }
  })
}



function _create(ticketId) {
  // 两面盘
  factory.addHandicapRule([ticketId, '210101'], {
    list: factory.createHandicapList([
      {
        items: [
          [
            {
              num: '1',
              title: '大',
              showOdds: true,
            },
            {
              num: '2',
              title: '小',
              showOdds: true,
            },
            {
              num: '3',
              title: '单',
              showOdds: true,
            },
            {
              num: '4',
              title: '双',
              showOdds: true,
            },
          ],
          [
            {
              num: '11',
              title: '大',
              showOdds: true,
            },
            {
              num: '12',
              title: '小',
              showOdds: true,
            },
            {
              num: '13',
              title: '单',
              showOdds: true,
            },
            {
              num: '14',
              title: '双',
              showOdds: true,
            },
          ],
          [
            {
              num: '21',
              title: '大',
              showOdds: true,
            },
            {
              num: '22',
              title: '小',
              showOdds: true,
            },
            {
              num: '23',
              title: '单',
              showOdds: true,
            },
            {
              num: '24',
              title: '双',
              showOdds: true,
            },
          ],
          [
            {
              num: '31',
              title: '大',
              showOdds: true,
            },
            {
              num: '32',
              title: '小',
              showOdds: true,
            },
            {
              num: '33',
              title: '单',
              showOdds: true,
            },
            {
              num: '34',
              title: '双',
              showOdds: true,
            },
          ],
        ],
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '总和/龙虎',
        items: [
          [
            {
              num: '1001',
              title: '总和大',
              showOdds: true,
            },
            {
              num: '1097',
              title: '龙',
              showOdds: true,
            },
          ],
          [
            {
              num: '1002',
              title: '总和小',
              showOdds: true,
            },
            {
              num: '1098',
              title: '虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1003',
              title: '总和大',
              showOdds: true,
            },
            {
              num: '1099',
              title: '和',
              showOdds: true,
            },
          ],
          [
            {
              num: '1004',
              title: '总和双',
              showOdds: true,
            },
          ],
        ],
        showOdds: true,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  //趣味盘
  factory.addHandicapRule([ticketId, '220101'], {
    list: factory.createHandicapList([
      {
        title: '前三码',
        items: [
          [
            {
              num: '1',
              title: '豹子',
              showOdds: true,
            },
          ],
          [
            {
              num: '2',
              title: '顺子',
              showOdds: true,
            },
          ],
          [
            {
              num: '3',
              title: '对子',
              showOdds: true,
            },
          ],
          [
            {
              num: '4',
              title: '杂六',
              showOdds: true,
            },
          ],
        ],
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '中三码',
        items: [
          [
            {
              num: '11',
              title: '豹子',
              showOdds: true,
            },
          ],
          [
            {
              num: '12',
              title: '顺子',
              showOdds: true,
            },
          ],
          [
            {
              num: '13',
              title: '对子',
              showOdds: true,
            },
          ],
          [
            {
              num: '14',
              title: '杂六',
              showOdds: true,
            },
          ],
        ],
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '后三码',
        items: [
          [
            {
              num: '21',
              title: '豹子',
              showOdds: true,
            },
          ],
          [
            {
              num: '22',
              title: '顺子',
              showOdds: true,
            },
          ],
          [
            {
              num: '23',
              title: '对子',
              showOdds: true,
            },
          ],
          [
            {
              num: '24',
              title: '杂六',
              showOdds: true,
            },
          ],
        ],
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  factory.addHandicapRule([ticketId, '230101'], {
    list: factory.createHandicapList([
      {
        title: ['第一球 - 万', '第二球 - 千', '第三球 - 百', '第四球 - 十', '第五球 - 个'],
        items: chunk(getFortyNine(), 10),
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })
}

module.exports = {
  install(ticketId) {
    _create(ticketId)
  },
}
