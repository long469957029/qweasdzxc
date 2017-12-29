/* eslint-disable no-irregular-whitespace */
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
    self.$('#jsDbCarousel').carousel({
      interval: 5000,
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

  // mode: 'horizontal',                 // 'horizontal', 'vertical', 'fade' 定义slider滚动的方向，有三个值可供选择
  // infiniteLoop: true,                 // true, false - display first slide after last 无限循环
  // hideControlOnEnd: false,            // true, false - if true, will hide 'next' control on last slide and 'prev' control on first 如果设置true，将会在最后一个幻灯片隐藏“next”，在最前面的幻灯片因此“prev”
  // controls: true,                     // true, false - previous and next controls 是否显示“previous”和“next”按钮
  // speed: 500,                         // integer - in ms, duration of time slide transitions will occupy   速度，单位为毫秒
  // easing: 'swing',                    // used with jquery.easing.1.3.js - see http://gsgd.co.uk/sandbox/jquery/easing/ for available options
  // pager: true,                        // true / false - display a pager
  // pagerSelector: null,                // jQuery selector - element to contain the pager. ex: '#pager'
  // pagerType: 'full',                  // 'full', 'short' - if 'full' pager displays 1,2,3... if 'short' pager displays 1 / 4   如果设置full，将显示1，2，3……，如果设置short，将显示1/4 .
  // pagerLocation: 'bottom',            // 'bottom', 'top' - location of pager 页码的位置
  // pagerShortSeparator: '/',           // string - ex: 'of' pager would display 1 of 4 页面分隔符
  // pagerActiveClass: 'pager-active',   // string - classname attached to the active pager link 当前页码的className
  // nextText: 'next',                   // string - text displayed for 'next' control 下一页的文字
  // nextImage: '',                      // string - filepath of image used for 'next' control. ex: 'images/next.jpg' 可以设置下一页为图片
  // nextSelector: null,                 // jQuery selector - element to contain the next control. ex: '#next'
  // prevText: 'prev',                   // string - text displayed for 'previous' control 上一页的文字
  // prevImage: '',                      // string - filepath of image used for 'previous' control. ex: 'images/prev.jpg' 上一页的图片
  // prevSelector: null,                 // jQuery selector - element to contain the previous control. ex: '#next'
  // captions: false,                    // true, false - display image captions (reads the image 'title' tag) 是否显示图片的标题，读取图片的title属性的内容。
  //
  // captionsSelector: null,             // jQuery selector - element to contain the captions. ex: '#captions'
  // auto: false,                        // true, false - make slideshow change automatically 幻灯片自动滚动
  // autoDirection: 'next',              // 'next', 'prev' - direction in which auto show will traverse 自动滚动的顺序
  // autoControls: false,                // true, false - show 'start' and 'stop' controls for auto show 自动滚动的控制键
  // autoControlsSelector: null,         // jQuery selector - element to contain the auto controls. ex: '#auto-controls'
  // autoStart: true,                    // true, false - if false show will wait for 'start' control to activate 
  // autoHover: false,                   // true, false - if true show will pause on mouseover 设置鼠标mouseover将会使自动滚动暂停
  // autoDelay: 0,                       // integer - in ms, the amount of time before starting the auto show
  // pause: 3000,                        // integer - in ms, the duration between each slide transition  过渡时间
  // startText: 'start',                 // string - text displayed for 'start' control 开始按钮的文字
  // startImage: '',                     // string - filepath of image used for 'start' control. ex: 'images/start.jpg' 开始按钮的图片
  // stopText: 'stop',                   // string - text displayed for 'stop' control 停止按钮的文本
  // stopImage: '',                      // string - filepath of image used for 'stop' control. ex: 'images/stop.jpg'   停止按钮的图片
  // ticker: false,                      // true, false - continuous motion ticker mode (think news ticker)
  //                                     // note: autoControls and autoControlsSelector apply to ticker!
  // tickerSpeed: 5000,                  // integer - has an inverse effect on speed. therefore, a value of 10000 will 
  //                                     // scroll very slowly while a value of 50 will scroll very quickly.
  // tickerDirection: 'next',            // 'next', 'prev' - direction in which ticker show will traverse
  // tickerHover: false,                 // true, false - if true ticker will pause on mouseover
  // wrapperClass: 'bx-wrapper',         // string - classname attached to the slider wraper
  // startingSlide: 0,                   // integer - show will start on specified slide. note: slides are zero based!
  // displaySlideQty: 1,                 // integer - number of slides to display at once
  // moveSlideQty: 1,                    // integer - number of slides to move at once
  // randomStart: false,                 // true, false - if true show will start on a random slide
})

module.exports = DashboardView
