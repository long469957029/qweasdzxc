
const rechargeAmountArr = [ //充值面值配置列表
  {
    id:0,
    name:'500元'
  },
  {
    id:1,
    name:'300元'
  },
  {
    id:2,
    name:'200元'
  },
  {
    id:3,
    name:'100元'
  },
  {
    id:4,
    name:'50元'
  },
  {
    id:5,
    name:'30元'
  },
  {
    id:6,
    name:'20元'
  },
  {
    id:7,
    name:'10元'
  }]

const flowAmountArr = [ // 流量面值配置列表
  {
    id:0,
    name:'10G'
  },
  {
    id:1,
    name:'3G'
  },
  {
    id:2,
    name:'2G'
  },
  {
    id:3,
    name:'1G'
  },
  {
    id:4,
    name:'1000M'
  },
  {
    id:5,
    name:'500M'
  },
  {
    id:6,
    name:'300M'
  },
  {
    id:7,
    name:'200M'
  },
  {
    id:8,
    name:'100M'
  },
  {
    id:9,
    name:'50M'
  },
  {
    id:10,
    name:'30M'
  },
  {
    id:11,
    name:'20M'
  }]

const  flowTypeArr = [ //流量类型配置列表
  {
    id:0,
    name:'全国流量：支持2G/3G/4G，当月有效'
  },
  {
    id:1,
    name:'省内流量：支持2G/3G/4G，当月有效'
  },
  {
    id:2,
    name:'省内流量：支持2G/3G/4G，当日有效，省内通用，立即生效'
  },
  {
    id:3,
    name:'省内流量：支持2G/3G/4G，充值成功后当日生效'
  }]

const qqAmountArr = [ //qq面值配置列表
  {
    id:0,
    name:'10元'
  },
  {
    id:1,
    name:'20元'
  },
  {
    id:2,
    name:'30元'
  },
  {
    id:3,
    name:'40元'
  },
  {
    id:4,
    name:'50元'
  },
  {
    id:5,
    name:'60元'
  },
  {
    id:6,
    name:'100元'
  },
  {
    id:7,
    name:'120元'
  }]

const qqTypeArr = [ //qq类型配置列表
  {
    id:0,
    name:'Q币'
  },
  {
    id:1,
    name:'QQ会员'
  },
  {
    id:2,
    name:'QQ超级会员'
  },
  {
    id:3,
    name:'QQ钻皇'
  },
  {
    id:4,
    name:'QQ黑钻'
  },
  {
    id:5,
    name:'QQ红钻'
  },
  {
    id:6,
    name:'QQ绿钻豪华版'
  },
  {
    id:7,
    name:'QQ黄钻'
  },
  {
    id:8,
    name:'QQ黄钻豪华版'
  },
  {
    id:9,
    name:'QQ蓝钻'
  },
  {
    id:10,
    name:'QQ蓝钻豪华版'
  },
  {
    id:11,
    name:'QQ飞车紫钻'
  },
  {
    id:12,
    name:'QQ堂紫钻'
  },
  {
    id:13,
    name:'QQ炫舞紫钻'
  },
  {
    id:14,
    name:'腾讯视频VIP会员'
  },
  {
    id:15,
    name:'腾讯体育会员'
  }
  ]

const getCfgName = (rechargeType,type,id) => { //获取各个配置名称 type：1表示面值 2表示类型
  let arr = []
  if(rechargeType === 1){
    arr = [...rechargeAmountArr]
  }else if(rechargeType === 2){
    if(type === 1){
      arr = [...flowAmountArr]
    }else{
      arr = [...flowTypeArr]
    }
  }else{
    if(type === 1){
      arr = [...qqAmountArr]
    }else{
      arr = [...qqTypeArr]
    }
  }
  return _(arr).where({id})[0].name
}

export {
  getCfgName
}
