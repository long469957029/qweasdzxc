//充值券 返水券 嘉奖券 补贴券 代金券 现金券
//满xx元  %
//使用范围 彩种，真人游戏 老虎机游戏 捕鱼游戏 彩票投注 彩票外游戏
export default ({bigShowNum, type, threholdAmount, bonusPercentAmount, statType, ticketId, gameType}) => {
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
    conditionNumber: 0,
    zhType: '',
    bigShowNum: 0,
  }

  switch (type) {
    //充值券
    case 101:
      couponInfo.bigShowNum = _.convert2yuan(bigShowNum)
      couponInfo.couponType = 1
      couponInfo.couponName = '充值券'
      couponInfo.conditionType = threholdAmount !== 0 ? 1 : 3
      couponInfo.conditionUnit = '元'
      couponInfo.conditionNumber = _.convert2yuan(threholdAmount)
      couponInfo.zhType = '充值'
      couponInfo.mainDesc = `${couponInfo.zhType}满${couponInfo.conditionNumber}元即返`
      couponInfo.style1 = 'task-charge'
      couponInfo.style2 = 'lucky-charge'
      break;
    case 102:
      couponInfo.bigShowNum = _.formatDiv(bonusPercentAmount, 100)
      couponInfo.couponType = 1
      couponInfo.couponName = '充值券'
      couponInfo.conditionType = 2
      couponInfo.conditionUnit = '%'
      couponInfo.conditionNumber = _.formatDiv(bonusPercentAmount, 100)
      couponInfo.zhType = '充值'
      couponInfo.mainDesc = `按${couponInfo.zhType}额${couponInfo.conditionNumber}%比例返`
      couponInfo.style1 = 'task-charge'
      couponInfo.style2 = 'lucky-charge'
      break;
    case 201:
      couponInfo.bigShowNum = _.convert2yuan(bigShowNum)
      couponInfo.couponType = 2
      couponInfo.couponName = '加奖券'
      couponInfo.conditionType = 1
      couponInfo.conditionUnit = '元'
      couponInfo.conditionNumber = _.convert2yuan(threholdAmount)
      couponInfo.mainDesc = formatRange({statType, ticketId, gameType})
      couponInfo.zhType = '中奖'
      couponInfo.secondDesc = `${couponInfo.zhType}满${couponInfo.conditionNumber}元即返`
      couponInfo.style1 = 'task-plus'
      couponInfo.style2 = 'lucky-plus'
      break;
    case 202:
      couponInfo.bigShowNum = _.formatDiv(bonusPercentAmount, 100)
      couponInfo.couponType = 2
      couponInfo.couponName = '加奖券'
      couponInfo.conditionType = 2
      couponInfo.conditionUnit = '%'
      couponInfo.conditionNumber = _.formatDiv(bonusPercentAmount, 100)
      couponInfo.mainDesc = formatRange({statType, ticketId, gameType})
      couponInfo.zhType = '中奖'
      couponInfo.secondDesc = `按${couponInfo.zhType}额${couponInfo.conditionNumber}%比例返`
      couponInfo.style1 = 'task-plus'
      couponInfo.style2 = 'lucky-plus'
      break;
    case 301:
      couponInfo.bigShowNum = _.convert2yuan(bigShowNum)
      couponInfo.couponType = 3
      couponInfo.couponName = '补贴券'
      couponInfo.conditionType = 1
      couponInfo.conditionUnit = '元'
      couponInfo.conditionNumber = _.convert2yuan(threholdAmount)
      couponInfo.mainDesc = formatRange({statType, ticketId, gameType})
      couponInfo.zhType = '亏损'
      couponInfo.secondDesc = `${couponInfo.zhType}满${couponInfo.conditionNumber}元即返`
      couponInfo.style1 = 'task-allowance'
      couponInfo.style2 = 'lucky-allowance'
      break;
    case 302:
      couponInfo.bigShowNum = _.formatDiv(bonusPercentAmount, 100)
      couponInfo.couponType = 3
      couponInfo.couponName = '补贴券'
      couponInfo.conditionType = 2
      couponInfo.conditionUnit = '%'
      couponInfo.conditionNumber = _.formatDiv(bonusPercentAmount, 100)
      couponInfo.mainDesc = formatRange({statType, ticketId, gameType})
      couponInfo.zhType = '亏损'
      couponInfo.secondDesc = `按${couponInfo.zhType}额${couponInfo.conditionNumber}%比例返`
      couponInfo.style1 = 'task-allowance'
      couponInfo.style2 = 'lucky-allowance'
      break;
    case 401:
      couponInfo.bigShowNum = _.convert2yuan(bigShowNum)
      couponInfo.couponType = 4
      couponInfo.couponName = '返水券'
      couponInfo.conditionType = 1
      couponInfo.conditionUnit = '元'
      couponInfo.conditionNumber = _.convert2yuan(threholdAmount)
      couponInfo.mainDesc = formatRange({statType, ticketId, gameType})
      couponInfo.zhType = '投注'
      couponInfo.secondDesc = `${couponInfo.zhType}满${couponInfo.conditionNumber}元即返`
      couponInfo.style1 = 'task-rebate'
      couponInfo.style2 = 'lucky-rebate'
      break;
    case 402:
      couponInfo.bigShowNum = _.formatDiv(bonusPercentAmount, 100)
      couponInfo.couponType = 4
      couponInfo.couponName = '返水券'
      couponInfo.conditionType = 2
      couponInfo.conditionUnit = '%'
      couponInfo.conditionNumber = _.formatDiv(bonusPercentAmount, 100)
      couponInfo.mainDesc = formatRange({statType, ticketId, gameType})
      couponInfo.zhType = '投注'
      couponInfo.secondDesc = `按${couponInfo.zhType}额${couponInfo.conditionNumber}%比例返`
      couponInfo.style1 = 'task-rebate'
      couponInfo.style2 = 'lucky-rebate'
      break;
    case 501:
      couponInfo.bigShowNum = _.convert2yuan(bigShowNum)
      couponInfo.couponType = 5
      couponInfo.couponName = '代金券'
      couponInfo.ticketId = ticketId
      couponInfo.conditionUnit = '元'
      couponInfo.conditionNumber = _.convert2yuan(threholdAmount)
      // return "返利游戏：" + ticketNameMap.get(this.getStatTicketId()) + "\n返利范围：全平台";
      couponInfo.mainDesc = formatRange({statType, ticketId, gameType})
      couponInfo.secondDesc = `单笔投注满${couponInfo.conditionNumber}元即可用`
      couponInfo.style1 = 'task-equivalent'
      couponInfo.style2 = 'lucky-equivalent'
      break;
    case 601:
      couponInfo.bigShowNum = _.convert2yuan(bigShowNum)
      couponInfo.couponType = 6
      couponInfo.conditionUnit = '元'
      couponInfo.couponName = '现金券'
      couponInfo.mainDesc = `领取即加币至账户余额`
      couponInfo.style1 = 'task-currency'
      couponInfo.style2 = 'lucky-currency'
      break;
    default:
      break;
  }

  return couponInfo
}

const formatRange = ({statType, ticketId, gameType}) => {
  let range = ''
  if(statType === 0 || !statType) {
    try {
      range = ticketId == null ? '彩票投注' : ticketConfig.getById(ticketId).zhName
    } catch (e) {
      range = ticketId
    }
  } else if (statType === 1) {
    if (!gameType) {
      range = '彩票外游戏'
    } else {
      switch(gameType) {
        case 1:
          range = '真人游戏'
          break;
        case 3:
          range = '老虎机游戏'
          break;
        case 4:
          range = '捕鱼游戏'
          break;
      }
    }
  }

  return range
}

export {
  formatRange
}
