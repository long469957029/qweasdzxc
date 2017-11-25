

require('./index.scss')


const AnniversaryView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-alertAnniversary': 'initialize',
    'click .js-close': 'closeAll',
  },

  closeAll () {
    this.destroy()
  },

  initialize() {
    this.checkState1()
  },
  //
  // onRender: function() {
  //     this.initPage();
  // },
  //
  // initPage: function(){
  // },

  closeActivityHandler() {
    this.destroy()
  },

  // TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  // checkState: function(){
  //     var self = this;
  //     this.getPrizeConfigInfoXhr().done(function(res){
  //         if(res && res.result===0){
  //             if(res.root.avaliable){
  //                 $('body').append(self.render().$el);
  //             }
  //             self.updateInfo(res);
  //         }
  //     })
  // },

  //  * 每次登录，是则弹出活动窗口 */
  checkState1($target) {
    const self = this
    $('body').append(self.render().$el)
    // $target.css('display','block');

    // this.getPrizeConfigInfoXhr().done(function(res){
    //     if(res && res.result === 0){
    //         /** avaliable 是否显示入口 */
    //         if( res.root.avaliable){
    //             $target.css('display','block');
    //             /** valid 是否首次登录,首次登录会自动弹出活动界面 */
    //             if(res.root.valid){
    //                 $('body').append(self.render().$el);
    //                 self.updateInfo(res);
    //             }
    //         }else{
    //             $target.remove();
    //         }
    //     }else{
    //         $target.remove();
    //     }
    // })
  },
  //
  // openPrizeWindow : function() {
  //     var self = this;
  //     self.getPrizeConfigInfoXhr().done(function(res) {
  //         var self1 = self;
  //         if (res && res.result === 0) {
  //             var data = self.data = res.root;
  //             var nextTime = data.nextWindowTime;
  //             if(nextTime>0) {
  //                 setTimeout(function () {
  //                     $('body').append(self.render().$el);
  //                     self1.openPrizeWindow();
  //                 },nextTime);
  //             }
  //         }
  //     });
  // }
})

module.exports = AnniversaryView
