/**
 * Created by steven on 2018/1/17.
 */
// 免登录白名单页面
const menuList = [
  {
    path: '/', // 路径
    desc: '首页', // 描述
    login: false, // 是否需要登录
    children: [ // 子路由配置，存放子模块及按钮访问权限
      {
        // path: '/index.html',
        // desc: '首页',
        // login: false,
        // children: [],
      },
    ],
  },
  {
    path: '/index.html',
    desc: '首页',
    login: false,
    children: [],
  },
  {
    path: '/sp',
    desc: '体育',
    login: false,
    children: [],
  },
  {
    path: '/rc',
    desc: '真人',
    login: false,
    children: [],
  },
  {
    path: '/sc',
    desc: '老虎机',
    login: false,
    children: [],
  },
  {
    path: '/fc',
    desc: '捕鱼',
    login: false,
    children: [],
  },
  {
    path: '/aa',
    desc: '优惠活动',
    login: false,
    children: [],
  },
  {
    path: '/ma',
    desc: '积分商城',
    login: false,
    children: [],
  },
]

export default menuList
