const lottery = {
  index: 0,	//当前转动到哪个位置，起点位置
  count: 0,	//总共有多少个位置
  timer: 0,	//setTimeout的ID，用clearTimeout清除
  speed: 20,	//初始转动速度
  times: 0,	//转动次数
  cycle: 50,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
  prize: 0,	//中奖位置
  init: function (className) {
    if ($("." + className).find(".pane").length > 0) {
      let $lottery = $("." + className);
      let $units = $lottery.find(".pane");
      this.obj = $lottery;
      this.count = $units.length;
      $lottery.find(".js-pane-" + this.index).addClass("active");
    };
  },
  roll: function () {
    let index = this.index;
    let count = this.count;
    let lottery = this.obj;
    $(lottery).find(".js-pane-" + index).removeClass("active");
    index += 1;
    if (index > count) {
      index = 1;
    };
    $(lottery).find(".js-pane-" + index).addClass("active");
    this.index = index;
    return false;
  },
  stop: function (index) {
    this.prize = index;
    return false;
  }
};

export default lottery
