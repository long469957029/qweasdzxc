module.exports = {
  page: 'gift',
  type: { // 查询类型选项
    title: '兑换类型',
    limit: 5, // 第五个之后的都放入"更多"的下拉选单
    options: [{
      type: null,
      name: '全部',
    }, { // 电子产品/汽车/生活用品/定制珍藏品
      type: 1,
      name: '电子产品',
    }, {
      type: 2,
      name: '汽车',
    }, {
      type: 3,
      name: '生活用品',
    }, {
      type: 4,
      name: '定制珍藏品',
    }],
  },
  status: { // 查询状态选项
    title: '兑换状态',
    options: [{
      status: 1,
      name: '有货',
    },
    {
      status: 2,
      name: '我可兑换的',
      color: 'blue',
    },
    {
      status: null,
      name: '全部',
    },
    ],
    showAmount: false, // 判断是否显示数量
  },
  sortable: true, // 是否显示排序功能
  search: false, // 是否显示搜寻框功能
}
