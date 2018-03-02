import factory from './betRulesFactory'

const fifty = _.range(1, 51)
const oneHundred = _.range(51, 101)

const getFifty = (numList) => {
  return _.map(numList, (num, index) => {
    const fNum = `${(num !== 0 && num % 10 === 0 ? 10 : (num % 10)) + (100 * Math.ceil(num / 10))}`
    return {
      num: fNum,
      title: num !== 0 && num % 10 === 0 ? 10 : (num % 10),
      posName: getPosName(fNum),
      style: 'gray circle',
    }
  })
}
const getPosName = (fNum) => {
  if (fNum.length > 3) {
    return '第十名'
  }
  switch (fNum[0]) {
    case '1':
      return '冠军'
    case '2':
      return '亚军'
    case '3':
      return '季军'
    case '4':
      return '第四名'
    case '5':
      return '第五名'
    case '6':
      return '第六名'
    case '7':
      return '第七名'
    case '8':
      return '第八名'
    case '9':
      return '第九名'
  }
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
        title: ['冠军', '亚军', '季军', '第四名', '第五名'],
        items: [
          [
            {
              num: '1',
              title: '大',
              playName: '大小',
              posName: '冠军',
              showOdds: true,
            },
            {
              num: '2',
              title: '小',
              playName: '大小',
              posName: '冠军',
              showOdds: true,
            },
            {
              num: '3',
              title: '单',
              playName: '单双',
              posName: '冠军',
              showOdds: true,
            },
            {
              num: '4',
              title: '双',
              playName: '单双',
              posName: '冠军',
              showOdds: true,
            },
          ],
          [
            {
              num: '11',
              title: '大',
              playName: '大小',
              posName: '亚军',
              showOdds: true,
            },
            {
              num: '12',
              title: '小',
              playName: '大小',
              posName: '亚军',
              showOdds: true,
            },
            {
              num: '13',
              title: '单',
              playName: '单双',
              posName: '亚军',
              showOdds: true,
            },
            {
              num: '14',
              title: '双',
              playName: '单双',
              posName: '亚军',
              showOdds: true,
            },
          ],
          [
            {
              num: '21',
              title: '大',
              playName: '大小',
              posName: '季军',
              showOdds: true,
            },
            {
              num: '22',
              title: '小',
              playName: '大小',
              posName: '季军',
              showOdds: true,
            },
            {
              num: '23',
              title: '单',
              playName: '单双',
              posName: '季军',
              showOdds: true,
            },
            {
              num: '24',
              title: '双',
              playName: '单双',
              posName: '季军',
              showOdds: true,
            },
          ],
          [
            {
              num: '31',
              title: '大',
              playName: '大小',
              posName: '第四名',
              showOdds: true,
            },
            {
              num: '32',
              title: '小',
              playName: '大小',
              posName: '第四名',
              showOdds: true,
            },
            {
              num: '33',
              title: '单',
              playName: '单双',
              posName: '第四名',
              showOdds: true,
            },
            {
              num: '34',
              title: '双',
              playName: '单双',
              posName: '第四名',
              showOdds: true,
            },
          ],
          [
            {
              num: '41',
              title: '大',
              playName: '大小',
              posName: '第五名',
              showOdds: true,
            },
            {
              num: '42',
              title: '小',
              playName: '大小',
              posName: '第五名',
              showOdds: true,
            },
            {
              num: '43',
              title: '单',
              playName: '单双',
              posName: '第五名',
              showOdds: true,
            },
            {
              num: '44',
              title: '双',
              playName: '单双',
              posName: '第五名',
              showOdds: true,
            },
          ],
        ],
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: ['第六名', '第七名', '第八名', '第九名', '第十名'],
        items: [
          [
            {
              num: '51',
              title: '大',
              playName: '大小',
              posName: '第六名',
              showOdds: true,
            },
            {
              num: '52',
              title: '小',
              playName: '大小',
              posName: '第六名',
              showOdds: true,
            },
            {
              num: '53',
              title: '单',
              playName: '单双',
              posName: '第六名',
              showOdds: true,
            },
            {
              num: '54',
              title: '双',
              playName: '单双',
              posName: '第六名',
              showOdds: true,
            },
          ],
          [
            {
              num: '61',
              title: '大',
              playName: '大小',
              posName: '第七名',
              showOdds: true,
            },
            {
              num: '62',
              title: '小',
              playName: '大小',
              posName: '第七名',
              showOdds: true,
            },
            {
              num: '63',
              title: '单',
              playName: '单双',
              posName: '第七名',
              showOdds: true,
            },
            {
              num: '64',
              title: '双',
              playName: '单双',
              posName: '第七名',
              showOdds: true,
            },
          ],
          [
            {
              num: '71',
              title: '大',
              playName: '大小',
              posName: '第八名',
              showOdds: true,
            },
            {
              num: '72',
              title: '小',
              playName: '大小',
              posName: '第八名',
              showOdds: true,
            },
            {
              num: '73',
              title: '单',
              playName: '单双',
              posName: '第八名',
              showOdds: true,
            },
            {
              num: '74',
              title: '双',
              playName: '单双',
              posName: '第八名',
              showOdds: true,
            },
          ],
          [
            {
              num: '81',
              title: '大',
              playName: '大小',
              posName: '第九名',
              showOdds: true,
            },
            {
              num: '82',
              title: '小',
              playName: '大小',
              posName: '第九名',
              showOdds: true,
            },
            {
              num: '83',
              title: '单',
              playName: '单双',
              posName: '第九名',
              showOdds: true,
            },
            {
              num: '84',
              title: '双',
              playName: '单双',
              posName: '第九名',
              showOdds: true,
            },
          ],
          [
            {
              num: '91',
              title: '大',
              playName: '大小',
              posName: '第十名',
              showOdds: true,
            },
            {
              num: '92',
              title: '小',
              playName: '大小',
              posName: '第十名',
              showOdds: true,
            },
            {
              num: '93',
              title: '单',
              playName: '单双',
              posName: '第十名',
              showOdds: true,
            },
            {
              num: '94',
              title: '双',
              playName: '单双',
              posName: '第十名',
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
              playName: '龙虎',
              posName: '第一、十名',
              showOdds: true,
            },
            {
              num: '1016',
              title: '虎',
              playName: '龙虎',
              posName: '第一、十名',
              showOdds: true,
            },
          ],
          [
            {
              num: '1017',
              title: '龙',
              playName: '龙虎',
              posName: '第二、九名',
              showOdds: true,
            },
            {
              num: '1018',
              title: '虎',
              playName: '龙虎',
              posName: '第二、九名',
              showOdds: true,
            },
          ],
          [
            {
              num: '1019',
              title: '龙',
              playName: '龙虎',
              posName: '第三、八名',
              showOdds: true,
            },
            {
              num: '1020',
              title: '虎',
              playName: '龙虎',
              posName: '第三、八名',
              showOdds: true,
            },
          ],
          [
            {
              num: '1021',
              title: '龙',
              playName: '龙虎',
              posName: '第四、七名',
              showOdds: true,
            },
            {
              num: '1022',
              title: '虎',
              playName: '龙虎',
              posName: '第四、七名',
              showOdds: true,
            },
          ],
          [
            {
              num: '1023',
              title: '龙',
              playName: '龙虎',
              posName: '第五、六名',
              showOdds: true,
            },
            {
              num: '1024',
              title: '虎',
              playName: '龙虎',
              posName: '第五、六名',
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
  factory.addHandicapRule([ticketId, '260101'], {
    list: factory.createHandicapList([
      {
        title: '冠、亚军和',
        items: [
          [
            {
              num: '3',
              title: '3',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '7',
              title: '7',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '11',
              title: '11',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '15',
              title: '15',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '19',
              title: '19',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '1011',
              playName: '大小',
              showTitle: '大',
              title: '冠亚和大',
              showOdds: true,
            },
          ],
          [
            {
              num: '4',
              title: '4',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '8',
              title: '8',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '12',
              title: '12',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '16',
              title: '16',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {},
            {
              num: '1012',
              playName: '大小',
              showTitle: '小',
              title: '冠亚和小',
              showOdds: true,
            },
          ],
          [
            {
              num: '5',
              title: '5',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '9',
              title: '9',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '13',
              title: '13',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '17',
              title: '17',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {},
            {
              num: '1013',
              playName: '单双',
              showTitle: '单',
              title: '冠亚和单',
              showOdds: true,
            },
          ],
          [
            {
              num: '6',
              title: '6',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '10',
              title: '10',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '14',
              title: '14',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {
              num: '18',
              title: '18',
              playName: '和值',
              style: 'gray circle',
              showOdds: true,
            },
            {},
            {
              num: '1014',
              playName: '单双',
              showTitle: '双',
              title: '冠亚和双',
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
  factory.addHandicapRule([ticketId, '230101'], {
    list: factory.createHandicapList([
      {
        title: ['冠军', '亚军', '季军', '第四名', '第五名'],
        items: _.chunk(getFifty(fifty), 10),
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: ['第六名', '第七名', '第八名', '第九名', '第十名'],
        items: _.chunk(getFifty(oneHundred), 10),
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
