# 积分商城说明

## 共用元件


### ./toolbar (用于简易搜寻)
#### 使用方式
```
// 引用元件
var toolbarView = require('mallCenter/toolbar');
// 引用设定配置
var giftToolbarConfig = require('./giftToolbarConfig.js')
// 渲染功能列
this.$pagination = this.$('.js-mall-gift-pagination');
this.pagination = new paginationView({
  pageIndex: 0,
  pageSize: 12,
  maxPaginationNum: 5,
  onPaginationChange: function (pageIndex) {
    this.fetchCurrentPageData(pageIndex); // 页数改变触发的 function
  },
  totalSize: 0,
})
this.$pagination.html(this.pagination.render().el);

// 资料更新时
self.pagination.update(data.rowCount, pageIndex);
```

#### 配置参考

```
// 礼物兑换中心页面
module.exports = {
  type: { // 查询类型选项
    page: 'gift', // coupon: 领券中心页面 myCoupon: 我的优惠券兑换记录页面 myGift: 我的礼物兑换记录页面 gift: 礼物兑换页面
    title: '兑换类型',
    limit: 5, // 第五个之后的都放入"更多"的下拉选单
    options: [{
      type: null,
      name: '全部',
    }, {
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
      }
    ],
    showAmount: false // 判断是否显示数量
  },
  sortable: true, // 是否显示排序功能
  search: false // 是否显示搜寻框功能
};

```

### ./pagination (分页)

#### 使用方式

```
// 引用
var paginationView = require('mallCenter/pagination');

// 定义每页数量
options: {
    pageSize: 12
  },

// 在 onRender 里面 new 一个分页元件
this.$pagination = this.$('.js-mall-gift-pagination');
this.pagination = new paginationView({
  pageIndex: 0,
  pageSize: 12,
  maxPaginationNum: 5,
  onPaginationChange: function (pageIndex) {
    this.fetchCurrentPageData(pageIndex);
  },
  totalSize: 0,
})

// 监听列表更新事件
this.on('gift:updating', function(data) {
  self.pagination.update(data.rowCount, 0);
  self.renderCurrentPage(data.records);
});

// 有关监听事件的触发可以看 mallCenter/toolbar/index.js 的 queryHandler 函式

// 渲染分页元件
this.$pagination.html(this.pagination.render().el);

// 重新获取资料时要 update 分页
fetchCurrentPageData: function (pageIndex) {
    var self = this;
    self.$container.empty();
    this.getGiftListXhr({
      pageSize: self.options.pageSize,
      pageIndex: pageIndex
    })
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        if (res && res.result === 0) {
          var data = res.root || {};
          self.pagination.update(data.rowCount, pageIndex);
          self.renderCurrentPage(data.records);
        } else {
          Global.ui.notification.show('加载失败，请稍后再试');
        }
      })
  },
```
