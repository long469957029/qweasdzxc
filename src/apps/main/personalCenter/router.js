const mainPersonalView = () => import(/* webpackChunkName: "main-personal" */ './main-personal')
const assetOverview = () => import(/* webpackChunkName: "about-us" */ './assetOverview/index')

export default [
  {
    path: '/personal', component: mainPersonalView,
    children: [
      {name: 'assetOverview',path: 'overview', component: assetOverview},
    ]
  }
]
