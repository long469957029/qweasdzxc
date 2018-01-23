const AboutUsView = () => import(/* webpackChunkName: "about-us" */ './index')

export default [
  {
    path: '/au',
    component: AboutUsView,
  },
]
