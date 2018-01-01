import '../misc/index.scss'

const bannerConfig = require('../misc/bannerConfig')

const DashboardView = Base.ItemView.extend({

  template: require('dashboard/templates/dashboard.html'),

  bannerTpl: _(require('dashboard/templates/banner.html')).template(),

  entryTpl: _(require('dashboard/templates/entry.html')).template(),

  dynamicTpl: _(require('dashboard/templates/dashboard-dynamic.html')).template(),

  events: {
    'click .js-db-prev': 'prevPageHandler',
    'click .js-db-next': 'nextPageHandler',
  },

  serializeData() {
    return {
      loading: Global.ui.loader.get(),
    }
  },

  /**
   * 获取平台动态
   * @param {string} token - 身分验证
   * @param {integer} pageSize - 页面含有项目数量
   * @param {integer} pageIndex - 页数
   * @apiSuccessExample {json} Success-Response:
   * {
        "root": {
          "buList": [
            {
              "title": "天天",
              "bulletionId": 221,
              "time": 1504859700000,
              "desc": "55",
              "isTop": 0
            }
          ],
          "rowCount": 44,
          "pageSize": 0,
          "pageIndex": 0
        }
      }
   */
  getDynamicXhr(data) {
    return Global.sync.ajax({
      url: '/info/activitylist/getbulletinlist.json',
      data,
    })
  },

  /**
   * 获取轮拨
   * @param {string} token - 身分验证
   * @apiSuccessExample {json} Success-Response:
   *
   */
  getBannerADXhr() {
    return Global.sync.ajax({
      url: '/acct/usernotice/getdashboardadvertise.json',
    })
  },

  onRender() {
    const self = this

    this.$('.js-db-game-entry-carousel').carousel({
      interval: 10000,
      pause: 'hover',
    })

    self.$imgList = self.$('.js-db-mb-item')
    self.$bulletinMarquee = self.$('.js-bulletin-marquee > marquee')
    self.$entryContainer = self.$('.js-dashboard-entry')
    // self.$ticketMain = self.$('.js-db-ticketList')
    // self.$dynamicList = self.$('.js-db-dynamic-list')

    // self.$pageSize = self.$('.js-db-pageSize')
    // self.$pageIndex = self.$('.js-db-pageIndex')
    // self.$rowCount = self.$('.js-db-rowCount')
    // self.$prevPage = self.$('.js-db-prev')
    // self.$nextPage = self.$('.js-db-next')

    self.subscribe('acct', 'acct:updating', () => {
      self.renderAcctInfoView()
    })

    self.renderEntry()
    self.renderMainBannerAD()
    self.renderbulletin()
  },

  renderEntry() {
    const self = this

    self.$entryContainer.html(self.entryTpl())
  },

  renderMainBannerAD() {
    const self = this

    this.getBannerADXhr().done((res) => {
      if (res.result === 0) {
        self.generateBannerAD(res.root)
      }else{
        self.generateBannerAD()
      }
    }).fail(() => {
      self.generateBannerAD()
    })
  },

  renderbulletin() {
    const self = this
    const newsList = [
      '[h5移动网页上线公告]我们使用先进的H5技术萌萌咑!',
      '[h5移动网页上线公告]我们使用先进的H5技术萌萌咑!',
      '[h5移动网页上线公告]我们使用先进的H5技术萌萌咑!',
    ]
    const html = _.map(newsList, (news) => {
      return `${'<li>' +
        '<span>'}${news}</span>` +
        '</li>'
    }).join('')
    self.$bulletinMarquee.html(html)
  },

  generateBannerAD(data) {
    const liList = []

    if (_(data).isEmpty()) {
      data = bannerConfig
    }

    _(data).each((item, index) => {
      liList.push(`<li data-target="#jsDbCarousel" data-slide-to="${index}${index === 0 ? '" class="active"' : '"'}></li>`)
    })

    this.$imgList.html(this.bannerTpl({
      data,
    }))
    this.$('#jsDbCarousel').carousel({
      interval: 5000,
    })
  },

  // renderDynamicList: function(data) {
  //   var self = this;
  //   this.getDynamicXhr(data)
  //     .done(function(res) {
  //       if (res.result === 0) {
  //         self.generateDynamicList(res.root);
  //         self.$pageIndex.val(data.pageIndex);
  //         self.$rowCount.val(res.root.rowCount);
  //         self.$prevPage.toggleClass('disabled', data.pageIndex < 1);

  //         var pageSize = Number(self.$pageSize.val());
  //         var rowCount = Number(res.root.rowCount);
  //         if (_(pageSize).isNumber()
  // && _(pageSize).isFinite()
  // && _(rowCount).isNumber()
  // && _(rowCount).isFinite()) {
  //           if (data.pageIndex >= Math.ceil(rowCount / pageSize) - 1) {
  //             self.$nextPage.addClass('disabled');
  //           } else {
  //             self.$nextPage.removeClass('disabled');
  //           }
  //         }
  //       }
  //     });
  // },

  // renderAcctInfoView: function() {
  //   var acctInfo = Global.memoryCache.get('acctInfo');

  //   this.$('.js-db-nickName').html(acctInfo.uName || acctInfo.username);
  //   this.$('.js-db-balance').html(acctInfo.fBalance);
  //   this.$('.js-db-lastLoginTime').html(acctInfo.fLastLoginTime);
  //   this.$('.js-db-curtIp').html(acctInfo.loginIp);

  //   if (acctInfo.loginIp !== acctInfo.lastLoginIp) {
  //     this.$('.js-db-diff-ip').removeClass('hidden');
  //   }
  // },

  // generateDynamicList: function(data) {
  //   this.$dynamicList.html(_(data.buList).map(function(item) {
  //     var date = moment(item.time);
  //     var day = date.date();
  //     var month = date.month() + 1;
  //     return this.dynamicTpl({
  //       day: day,
  //       month: month,
  //       desc: item.desc,
  //       title: item.title,
  //       bulletionId: item.bulletionId,
  //       isTop:item.isTop
  //     });
  //   }, this).join(''));
  // },

  // prevPageHandler: function() {
  //   var pageIndex = this.$pageIndex.val();
  //   if (pageIndex === '0') {
  //     return false;
  //   }

  //   var data = {pageSize: this.$pageSize.val(), pageIndex: pageIndex - 1};

  //   this.renderDynamicList(data);
  // },

  // nextPageHandler: function() {
  //   var pageIndex = Number(this.$pageIndex.val());
  //   var pageSize = Number(this.$pageSize.val());
  //   var rowCount = Number(this.$rowCount.val());

  //   if (_(pageSize).isNumber()
  // && _(pageSize).isFinite()
  // && _(rowCount).isNumber()
  // && _(rowCount).isFinite()) {
  //     if (pageIndex === Math.ceil(rowCount / pageSize) - 1) {
  //       return false;
  //     } else {
  //       var data = {
  //         pageSize: pageSize,
  //         pageIndex: pageIndex + 1
  //       };

  //       this.renderDynamicList(data);
  //     }
  //   }
  // },

  // $(function(){
  //   $('#marquee').bxSlider({
  //     mode:'vertical', //默认的是水平
  //     displaySlideQty:1,//显示li的个数
  //     moveSlideQty: 1,//移动li的个数
  //     captions: true,//自动控制
  //     auto: true,
  //     controls: false//隐藏左右按钮
  //   });
  // });

  // .bx-prev{ width:12px; height:26px; background:#f00;text-indent: -999999px;z-index: 999;  position: absolute; float:left; left:455px; top:110px;}
  // .bx-next{ width:12px; height:26px;  background:#f00; text-indent: -999999px;z-index: 999;  position: absolute; top:110px;left:-15px;}


})

module.exports = DashboardView
