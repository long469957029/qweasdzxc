const MallCenterView = () => import(/* webpackChunkName: "mall-center" */ './index/index')
const InstructionView = () => import(/* webpackChunkName: "mall-center" */ './instruction/index')

export default [
  {
    path: '/ma',
    component: function(resolve) {
      RouterController.async(resolve, MallCenterView, {
        hideHeaderRight: true,
      })
    },
  },
  {
    path: '/mad',
    component: function(resolve) {
      RouterController.async(resolve, InstructionView, {
        hideHeaderRight: true,
      })
    },
  },
]
