
// 四星:20002
// 前三星:20003
// 中三星:20004
// 后三星:20005
// 前二星:20006
// 后二星:20007
// 一星万位:20008
// 一星千位:20009
// 一星百位:20010
// 一星十位:20011
// 一星个位:20012
//
// 3D_三星 20016
// 3D_前二星 20017
// 3D_后二星 20018
// 3D_百位 20020
// 3D_十位 20021
// 3D_个位 20022

const sccPlaySeriesIdList = [
  {
    title: '五星',
    id: 20001,
  }
]

const threeDPlaySeriesIdList = [
  {
    title: '三星',
    id: 20016,
  }
]

export const SSC = {
  range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  counts: 5,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 5),
  defaultSelectPlay: '4',
  type: 'ssc',
  positions: ['万位', '千位', '百位', '十位', '个位'],
  trend: true,
  abbreviated: true,
  playSeriesIdList: sccPlaySeriesIdList,
  helpPage: 'SscLottery',
}

export const CHOOSE15 = {
  range: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
  counts: 5,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 5),
  defaultSelectPlay: '4,0,4',
  type: 'choose15',
  positions: ['第一位', '第二位', '第三位', '第四位', '第五位'],
  abbreviated: true,
  trend: true,
  helpPage: 'SyxwLottery',
}

export const THREED = {
  range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  counts: 3,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 3),
  defaultSelectPlay: '0',
  type: 'threeD',
  positions: ['百位', '十位', '个位'],
  trend: true,
  playSeriesIdList: threeDPlaySeriesIdList,
  helpPage: 'DpLottery',
}

export const P5P3 = {
  range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  counts: 5,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 5),
  defaultSelectPlay: '0',
  type: 'p5p3',
  positions: ['万位', '千位', '百位', '十位', '个位'],
  trend: true,
  helpPage: 'DpLottery',
}

export const PK10 = {
  range: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
  counts: 10,
  openingType: 'balls',
  defaultOpening: R.repeat('01', 10),
  defaultSelectPlay: '4',
  type: 'pk10',
  positions: ['冠军', '亚军', '季军', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'],
  trend: true,
  helpPage: 'Pk10Lottery',
}

export const QUICK3 = {
  range: ['1', '2', '3', '4', '5', '6'],
  counts: 3,
  openingType: 'dices',
  defaultOpening: R.repeat('3', 3),
  defaultSelectPlay: '9',
  type: 'quick3',
  positions: ['万位', '千位', '百位'],
  abbreviated: true,
  trend: true,
  helpPage: 'KsLottery',
}


const redList = ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46']
const blueList = ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48']
const greenList = ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49']

const fortyNine = _.range(1, 50)

const getFortyNine = () => {
  return _.map(fortyNine, (num) => {
    num = num < 10 ? `0${num}` : `${num}`
    if (_.indexOf(redList, num) > -1) {
      return {
        num,
        title: num,
        style: 'red circle',
        sx: store.getters.sxNameByNum(num)
      }
    } else if (_.indexOf(blueList, num) > -1) {
      return {
        num,
        title: num,
        style: 'blue circle',
        sx: store.getters.sxNameByNum(num)
      }
    } else if (_.indexOf(greenList, num) > -1) {
      return {
        num,
        title: num,
        style: 'green circle',
        sx: store.getters.sxNameByNum(num)
      }
    }
  })
}

export const MARK6 = {
  range: getFortyNine,
  counts: 7,
  openingType: 'mark-balls',
  defaultOpening: R.repeat('01', 7),
  defaultSelectPlay: '0',
  getNum: getFortyNine,
  type: 'mark6',
  trend: false,
}

/** @typedef {Object} bettingTypes */
export default {
  SSC,
  CHOOSE15,
  THREED,
  QUICK3,
  P5P3,
  PK10,
  MARK6,
}
