export const SSC = {
  range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  counts: 5,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 5),
  defaultSelectPlay: '4',
  type: 'ssc',
}

export const CHOOSE15 = {
  range: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
  counts: 5,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 5),
  defaultSelectPlay: '4,0,4',
  type: 'choose15',
}

export const THREED = {
  range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  counts: 3,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 3),
  defaultSelectPlay: '0',
  type: 'threeD',
}

export const P5P3 = {
  range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  counts: 5,
  openingType: 'balls',
  defaultOpening: R.repeat('0', 5),
  defaultSelectPlay: '0',
  type: 'p5p3',
}

export const PK10 = {
  range: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
  counts: 10,
  openingType: 'balls',
  defaultOpening: R.repeat('01', 10),
  defaultSelectPlay: '4',
  type: 'pk10',
}

export const QUICK3 = {
  range: ['1', '2', '3', '4', '5', '6'],
  counts: 3,
  openingType: 'dices',
  defaultOpening: R.repeat('3', 3),
  defaultSelectPlay: '9',
  type: 'quick3',
}


const redList = ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46']
const blueList = ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48']
const greenList = ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49']

const fortyNine = _.range(1, 50)

const shengXiao = {
  '10': '鼠',
  '22': '鼠',
  '34': '鼠',
  '46': '鼠',
  '09': '牛',
  '21': '牛',
  '33': '牛',
  '45': '牛',
  '08': '虎',
  '20': '虎',
  '32': '虎',
  '44': '虎',
  '07': '兔',
  '19': '兔',
  '31': '兔',
  '43': '兔',
  '06': '龙',
  '18': '龙',
  '30': '龙',
  '42': '龙',
  '05': '蛇',
  '17': '蛇',
  '29': '蛇',
  '41': '蛇',
  '04': '马',
  '16': '马',
  '28': '马',
  '40': '马',
  '03': '羊',
  '15': '羊',
  '27': '羊',
  '39': '羊',
  '02': '猴',
  '14': '猴',
  '26': '猴',
  '38': '猴',
  '01': '鸡',
  '13': '鸡',
  '25': '鸡',
  '37': '鸡',
  '49': '鸡',
  '12': '狗',
  '24': '狗',
  '36': '狗',
  '48': '狗',
  '11': '猪',
  '23': '猪',
  '35': '猪',
  '47': '猪',
}

const getFortyNine = () => {
  return _.map(fortyNine, (num) => {
    num = num < 10 ? `0${num}` : `${num}`
    if (_.indexOf(redList, num) > -1) {
      return {
        num,
        title: num,
        style: 'red circle',
        sx: shengXiao[num]
      }
    } else if (_.indexOf(blueList, num) > -1) {
      return {
        num,
        title: num,
        style: 'blue circle',
        sx: shengXiao[num]
      }
    } else if (_.indexOf(greenList, num) > -1) {
      return {
        num,
        title: num,
        style: 'green circle',
        sx: shengXiao[num]
      }
    }
  })
}

export const MARK6 = {
  range: getFortyNine(),
  counts: 7,
  openingType: 'mark-balls',
  defaultOpening: R.repeat('01', 7),
  defaultSelectPlay: '0',
  getNum: getFortyNine,
  sx: shengXiao,
  type: 'mark6',
}
