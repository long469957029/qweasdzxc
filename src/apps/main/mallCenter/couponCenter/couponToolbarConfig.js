module.exports = {
  page: 'coupon',
  type: { // 查询类型选项
    title: '券类型',
    limit: 5, // 第五个之后的都放入"更多"的下拉选单
    options: [{
      type: null,
      name: '全部',
    }, {
      type: 1,
      name: '充值券',
    }, {
      type: 2,
      name: '加奖券',
    }, {
      type: 3,
      name: '补贴券',
    }, {
      type: 4,
      name: '返水券',
    }, {
      type: 5,
      name: '代金券',
    }, {
      type: 6,
      name: '现金券',
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
