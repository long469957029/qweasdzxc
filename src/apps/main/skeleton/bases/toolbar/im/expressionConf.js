/**
 * Created by steven on 2018/3/12.
 */
const expressionList = [
  {
    title: '微笑',
    url: require('base/images/face/face-1.gif'),
    style: 'face-1'
  },
  {
    title: '尴尬',
    url: require('base/images/face/face-2.gif'),
    style: 'face-2'
  },
  {
    title: '发怒',
    url: require('base/images/face/face-3.gif'),
    style: 'face-3'
  },
  {
    title: '调皮',
    url: require('base/images/face/face-4.gif'),
    style: 'face-4'
  },
  {
    title: '呲牙',
    url: require('base/images/face/face-5.gif'),
    style: 'face-5'
  },
  {
    title: '惊讶',
    url: require('base/images/face/face-6.gif'),
    style: 'face-6'
  },
  {
    title: '难过',
    url: require('base/images/face/face-7.gif'),
    style: 'face-7'
  },
  {
    title: '囧',
    url: require('base/images/face/face-8.gif'),
    style: 'face-8'
  },
  {
    title: '抓狂',
    url: require('base/images/face/face-9.gif'),
    style: 'face-9'
  },
  {
    title: '吐',
    url: require('base/images/face/face-10.gif'),
    style: 'face-10'
  },
  {
    title: '偷笑',
    url: require('base/images/face/face-11.gif'),
    style: 'face-11'
  },
  {
    title: '撇嘴',
    url: require('base/images/face/face-12.gif'),
    style: 'face-12'
  },
  {
    title: '愉快',
    url: require('base/images/face/face-13.gif'),
    style: 'face-13'
  },
  {
    title: '白眼',
    url: require('base/images/face/face-14.gif'),
    style: 'face-14'
  },
  {
    title: '傲慢',
    url: require('base/images/face/face-15.gif'),
    style: 'face-15'
  },
  {
    title: '舔嘴',
    url: require('base/images/face/face-16.gif'),
    style: 'face-16'
  },
  {
    title: '困',
    url: require('base/images/face/face-17.gif'),
    style: 'face-17'
  },
  {
    title: '惊恐',
    url: require('base/images/face/face-18.gif'),
    style: 'face-18'
  },
  {
    title: '流汗',
    url: require('base/images/face/face-19.gif'),
    style: 'face-19'
  },
  {
    title: '憨笑',
    url: require('base/images/face/face-20.gif'),
    style: 'face-20'
  },
  {
    title: '悠闲',
    url: require('base/images/face/face-21.gif'),
    style: 'face-21'
  },
  {
    title: '奋斗',
    url: require('base/images/face/face-22.gif'),
    style: 'face-22'
  },
  {
    title: '色',
    url: require('base/images/face/face-23.gif'),
    style: 'face-23'
  },
  {
    title: '咒骂',
    url: require('base/images/face/face-24.gif'),
    style: 'face-24'
  },
  {
    title: '疑问',
    url: require('base/images/face/face-25.gif'),
    style: 'face-25'
  },
  {
    title: '嘘',
    url: require('base/images/face/face-26.gif'),
    style: 'face-26'
  },
  {
    title: '晕',
    url: require('base/images/face/face-27.gif'),
    style: 'face-27'
  },
  {
    title: '衰',
    url: require('base/images/face/face-28.gif'),
    style: 'face-28'
  },
  {
    title: '敲打',
    url: require('base/images/face/face-29.gif'),
    style: 'face-29'
  },
  {
    title: '再见',
    url: require('base/images/face/face-30.gif'),
    style: 'face-30'
  },
  {
    title: '擦汗',
    url: require('base/images/face/face-31.gif'),
    style: 'face-31'
  },
  {
    title: '抠鼻',
    url: require('base/images/face/face-32.gif'),
    style: 'face-32'
  },
  {
    title: '发呆',
    url: require('base/images/face/face-33.gif'),
    style: 'face-33'
  },
  {
    title: '惊讶',
    url: require('base/images/face/face-34.gif'),
    style: 'face-34'
  },
  {
    title: '坏笑',
    url: require('base/images/face/face-35.gif'),
    style: 'face-35'
  },
  {
    title: '左哼哼',
    url: require('base/images/face/face-36.gif'),
    style: 'face-36'
  },
  {
    title: '右哼哼',
    url: require('base/images/face/face-37.gif'),
    style: 'face-37'
  },
  {
    title: '哈欠',
    url: require('base/images/face/face-38.gif'),
    style: 'face-38'
  },
  {
    title: '鄙视',
    url: require('base/images/face/face-39.gif'),
    style: 'face-39'
  },
  {
    title: '委屈',
    url: require('base/images/face/face-40.gif'),
    style: 'face-40'
  },
  {
    title: '快哭了',
    url: require('base/images/face/face-41.gif'),
    style: 'face-41'
  },
  {
    title: '阴险',
    url: require('base/images/face/face-42.gif'),
    style: 'face-42'
  },
  {
    title: '亲亲',
    url: require('base/images/face/face-43.gif'),
    style: 'face-43'
  },
  {
    title: '流泪',
    url: require('base/images/face/face-44.gif'),
    style: 'face-44'
  },
  {
    title: '汗',
    url: require('base/images/face/face-45.gif'),
    style: 'face-45'
  },
  {
    title: '可怜',
    url: require('base/images/face/face-46.gif'),
    style: 'face-46'
  },
  {
    title: '拥抱',
    url: require('base/images/face/face-47.gif'),
    style: 'face-47'
  },
  {
    title: '月亮',
    url: require('base/images/face/face-48.gif'),
    style: 'face-48'
  },
  {
    title: '太阳',
    url: require('base/images/face/face-49.gif'),
    style: 'face-49'
  },
  {
    title: '炸弹',
    url: require('base/images/face/face-50.gif'),
    style: 'face-50'
  },
  {
    title: '骷髅',
    url: require('base/images/face/face-51.gif'),
    style: 'face-51'
  },
  {
    title: '菜刀',
    url: require('base/images/face/face-52.gif'),
    style: 'face-52'
  },
  {
    title: '猪头',
    url: require('base/images/face/face-53.gif'),
    style: 'face-53'
  },
  {
    title: '西瓜',
    url: require('base/images/face/face-54.gif'),
    style: 'face-54'
  },
  {
    title: '害羞',
    url: require('base/images/face/face-55.gif'),
    style: 'face-55'
  },
  {
    title: '咖啡',
    url: require('base/images/face/face-56.gif'),
    style: 'face-56'
  },
  {
    title: '吃饭',
    url: require('base/images/face/face-57.gif'),
    style: 'face-57'
  },
  {
    title: '爱心',
    url: require('base/images/face/face-58.gif'),
    style: 'face-58'
  },
  {
    title: '强',
    url: require('base/images/face/face-59.gif'),
    style: 'face-59'
  },
  {
    title: '弱',
    url: require('base/images/face/face-60.gif'),
    style: 'face-60'
  },
  {
    title: '握手',
    url: require('base/images/face/face-61.gif'),
    style: 'face-61'
  },
  {
    title: '胜利',
    url: require('base/images/face/face-62.gif'),
    style: 'face-62'
  },
  {
    title: '抱拳',
    url: require('base/images/face/face-63.gif'),
    style: 'face-63'
  },
  {
    title: '勾引',
    url: require('base/images/face/face-64.gif'),
    style: 'face-64'
  },
  {
    title: 'OK',
    url: require('base/images/face/face-65.gif'),
    style: 'face-65'
  },
  {
    title: '闭嘴',
    url: require('base/images/face/face-66.gif'),
    style: 'face-66'
  },
  {
    title: 'NO',
    url: require('base/images/face/face-67.gif'),
    style: 'face-67'
  },
  {
    title: '玫瑰',
    url: require('base/images/face/face-68.gif'),
    style: 'face-68'
  },
  {
    title: '凋谢',
    url: require('base/images/face/face-69.gif'),
    style: 'face-69'
  },
  {
    title: '嘴唇',
    url: require('base/images/face/face-70.gif'),
    style: 'face-70'
  },
  {
    title: '亲亲',
    url: require('base/images/face/face-71.gif'),
    style: 'face-71'
  },
  {
    title: '飞吻',
    url: require('base/images/face/face-72.gif'),
    style: 'face-72'
  },
  {
    title: '睡',
    url: require('base/images/face/face-73.gif'),
    style: 'face-73'
  },
  {
    title: '大哭',
    url: require('base/images/face/face-74.gif'),
    style: 'face-74'
  },
]
module.exports = {
  get(title) {
    return _(expressionList).findWhere({
      title,
    })
  },
  getAll() {
    return _(expressionList)
  },
}
