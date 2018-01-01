import betFormat from './betFormat'
import factory from 'bettingCenter/misc/betRulesFactory'
import { chunk } from 'lodash'

const fortyNine = _.range(1, 50)
const oneHundred = _.range(51, 100)

const getFortyNine = (numList) => {
  return _.map(numList, (num, index) => {
    const fMum = `${(num !== 0 && num % 10 === 0 ? 10 : (num % 10)) + (100 * Math.ceil((index + 1) / 10))}`
    return {
      num: fMum,
      title: num !== 0 && num % 10 === 0 ? 10 : (num % 10),
      style: 'gray circle',
    }
  })
}

const getBalls = () => {
  return [
    [
      {
        num: '0',
        title: '0',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '1',
        title: '1',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '1001',
        title: '大',
        showOdds: true,
      },
    ],
    [
      {
        num: '2',
        title: '2',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '3',
        title: '3',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '1002',
        title: '小',
        showOdds: true,
      },
    ],
    [
      {
        num: '4',
        title: '4',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '5',
        title: '5',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '1003',
        title: '单',
        showOdds: true,
      },
    ],
    [
      {
        num: '6',
        title: '6',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '7',
        title: '7',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '1004',
        title: '双',
        showOdds: true,
      },
    ],
    [
      {
        num: '8',
        title: '8',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '9',
        title: '9',
        style: 'gray circle',
        showOdds: true,
      },
    ],
  ]
}



function _create(ticketId) {
  // 两面盘
  factory.addHandicapRule([ticketId, '210101'], {
    list: factory.createHandicapList([
      {
        title: ['第一球', '第二球', '第三球', '第四球', '第五球'],
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
          [
            {
              num: '41',
              title: '大',
              showOdds: true,
            },
            {
              num: '42',
              title: '小',
              showOdds: true,
            },
            {
              num: '43',
              title: '单',
              showOdds: true,
            },
            {
              num: '44',
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
        title: ['第六球', '第七球', '第八球', '第九球', '第十球'],
        items: [
          [
            {
              num: '51',
              title: '大',
              showOdds: true,
            },
            {
              num: '52',
              title: '小',
              showOdds: true,
            },
            {
              num: '53',
              title: '单',
              showOdds: true,
            },
            {
              num: '54',
              title: '双',
              showOdds: true,
            },
          ],
          [
            {
              num: '61',
              title: '大',
              showOdds: true,
            },
            {
              num: '62',
              title: '小',
              showOdds: true,
            },
            {
              num: '63',
              title: '单',
              showOdds: true,
            },
            {
              num: '64',
              title: '双',
              showOdds: true,
            },
          ],
          [
            {
              num: '71',
              title: '大',
              showOdds: true,
            },
            {
              num: '72',
              title: '小',
              showOdds: true,
            },
            {
              num: '73',
              title: '单',
              showOdds: true,
            },
            {
              num: '74',
              title: '双',
              showOdds: true,
            },
          ],
          [
            {
              num: '81',
              title: '大',
              showOdds: true,
            },
            {
              num: '82',
              title: '小',
              showOdds: true,
            },
            {
              num: '83',
              title: '单',
              showOdds: true,
            },
            {
              num: '84',
              title: '双',
              showOdds: true,
            },
          ],
          [
            {
              num: '91',
              title: '大',
              showOdds: true,
            },
            {
              num: '92',
              title: '小',
              showOdds: true,
            },
            {
              num: '93',
              title: '单',
              showOdds: true,
            },
            {
              num: '94',
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
        title: ['第一、十名龙虎', '第二、九名龙虎', '第三、八名龙虎', '第四、七名龙虎', '第五、六名龙虎'],
        items: [
          [
            {
              num: '1015',
              title: '龙',
              showOdds: true,
            },
            {
              num: '1016',
              title: '虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1017',
              title: '龙',
              showOdds: true,
            },
            {
              num: '1018',
              title: '虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1019',
              title: '龙',
              showOdds: true,
            },
            {
              num: '1020',
              title: '虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1021',
              title: '龙',
              showOdds: true,
            },
            {
              num: '1022',
              title: '虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1023',
              title: '龙',
              showOdds: true,
            },
            {
              num: '1024',
              title: '虎',
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

  //冠亚和
  factory.addHandicapRule([ticketId, '220101'], {
    list: factory.createHandicapList([
      {
        title: '冠、亚军和',
        items: [
          [
            {
              num: '3',
              title: '3',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '7',
              title: '7',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '11',
              title: '11',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '15',
              title: '15',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '19',
              title: '19',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '1011',
              title: '冠亚大',
              showOdds: true,
            },
          ],
          [
            {
              num: '4',
              title: '4',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '8',
              title: '8',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '12',
              title: '12',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '16',
              title: '16',
              style: 'gray circle',
              showOdds: true,
            },
            {
            },
            {
              num: '1012',
              title: '冠亚小',
              showOdds: true,
            },
          ],
          [
            {
              num: '5',
              title: '5',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '9',
              title: '9',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '13',
              title: '13',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '17',
              title: '17',
              style: 'gray circle',
              showOdds: true,
            },
            {
            },
            {
              num: '1013',
              title: '冠亚单',
              showOdds: true,
            },
          ],
          [
            {
              num: '6',
              title: '6',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '10',
              title: '10',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '14',
              title: '14',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '18',
              title: '18',
              style: 'gray circle',
              showOdds: true,
            },
            {
            },
            {
              num: '1014',
              title: '冠亚双',
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

  //1-10名
  factory.addHandicapRule([ticketId, '310101'], {
    list: factory.createHandicapList([
      {
        title: ['冠军', '亚军', '季军', '第四名', '第五名'],
        items: chunk(getFortyNine(fortyNine), 10),
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: ['第六名', '第七名', '第八名', '第九名', '第十名'],
        items: chunk(getFortyNine(oneHundred), 10),
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      }
    ]),
    bettingArea: ['top', 'bottom'],
  })
}

module.exports = {
  install(ticketId) {
    _create(ticketId)
  },
}
