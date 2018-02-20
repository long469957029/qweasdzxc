//充值券 返水券 嘉奖券 补贴券 代金券 现金券
//满xx元  %
//使用范围 彩种，真人游戏 老虎机游戏 捕鱼游戏 彩票投注 彩票外游戏
export default ({type, threholdAmount, ticketId}) => {
  /**
   *
   * couponType 券类型id
   * couponName 券名
   * conditionType 券使用条件种类 - 1 满xx元返 2 比例返 3 无条件
   * @type {{couponType: number, couponName: string, conditionType: number, ticketId: number}}
   */
  let couponInfo = {
    couponType: -1,
    couponName: '',
    conditionType: -1,
    ticketId: -1,
    mainDesc: '',
    secondDesc: '',
  }

  switch (type) {
    //充值券
    case 101:
      couponInfo.couponType = 1
      couponInfo.couponName = '充值券'
      couponInfo.conditionType = threholdAmount !== 0 ? 1 : 3
      couponInfo.mainDesc = `充值满${_.convert2yuan(threholdAmount)}元即返`
      break;
    case 102:
      couponInfo.couponType = 1
      couponInfo.couponName = '充值券'
      couponInfo.conditionType = 2
      couponInfo.mainDesc = `按充值额${_.convert2yuan(threholdAmount)}比例返`
      break;
    case 201:
      couponInfo.couponType = 2
      couponInfo.couponName = '加奖卡'
      couponInfo.conditionType = 1
      break;
    case 202:
      couponInfo.couponType = 2
      couponInfo.couponName = '加奖卡'
      couponInfo.conditionType = 2
      break;
    case 301:
      couponInfo.couponType = 3
      couponInfo.couponName = '补贴卡'
      couponInfo.conditionType = 1
      break;
    case 302:
      couponInfo.couponType = 3
      couponInfo.couponName = '补贴卡'
      couponInfo.conditionType = 2
      break;
    case 401:
      couponInfo.couponType = 4
      couponInfo.couponName = '返水卡'
      couponInfo.conditionType = 1
      break;
    case 402:
      couponInfo.couponType = 4
      couponInfo.couponName = '返水卡'
      couponInfo.conditionType = 2
      break;
    case 501:
      couponInfo.couponType = 5
      couponInfo.couponName = '代金券'
      couponInfo.ticketId = ticketId
      return "返利游戏：" + ticketNameMap.get(this.getStatTicketId()) + "\n返利范围：全平台";
      couponInfo.secondDesc = `单笔投注满${}元即可用`
      break;
    case 601:
      couponInfo.couponType = 6
      couponInfo.couponName = '现金券'
      couponInfo.mainDesc = `领取即加币至账户余额`
      break;
    default:
      break;
  }

  return couponInfo
}
