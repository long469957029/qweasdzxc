//components
import StaticGrid from './components/static-grid'
import SlotStaticGrid from './components/static-grid/slot-index'
import AnimatedInteger from './components/animated-integer'
import CustomCheckbox from './components/custom-checkbox'
import XDialog from './components/x-dialog'
import Popover from './components/popover'
import Countdown from './components/countdown/index.vue'
import PointsCard from './components/points-card'
import RadioGroup from './components/RadioGroup'
import SearchGrid from './components/search-grid'
import XPagination from './components/x-pagination'
import ControlGroup from './components/control-group'
import ControlCell from './components/control-cell'
import XAddress from './components/x-address'
import {Swiper, SwiperSlide} from './components/swiper'

//directives
import TransferDom from './directives/transfer-dom'

//plugins
import BusPlugin from './plugins/bus/index.js'

//filters
import quick3Sum from './filters/quick3-sum'
import twoSideType from './filters/two-side-type'
import formatOpenNum from './filters/format-open-num'
import formatCouponType from './filters/format-coupon-type'
import formatCoupon from './filters/format-coupon'

export {
  AnimatedInteger,
  CustomCheckbox,
  StaticGrid,
  PointsCard,
  SlotStaticGrid,
  XDialog,
  Popover,
  Countdown,
  RadioGroup,
  SearchGrid,
  XPagination,
  ControlGroup,
  ControlCell,
  Swiper,
  SwiperSlide,
  XAddress,

  TransferDom,

  BusPlugin,

  formatCouponType,
  formatOpenNum,
  quick3Sum,
  twoSideType,
  formatCoupon,
}
