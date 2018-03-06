//components
import StaticGrid from './components/static-grid'
import SlotStaticGrid from './components/static-grid/slot-index'
import AnimatedInteger from './components/animated-integer'
import CustomCheckbox from './components/custom-checkbox'
import XDialog from './components/x-dialog'
import Popover from './components/popover'
import Tooltip from './components/popover/Tooltip'
import Countdown from './components/countdown/index.vue'
import PointsCard from './components/points-card'
import RadioGroup from './components/RadioGroup'
import SearchGrid from './components/search-grid'
import XPagination from './components/x-pagination'
import ControlGroup from './components/control-group'
import ControlCell from './components/control-cell'
import XAddress from './components/x-address'
import {Swiper, SwiperSlide} from './components/swiper'
import XToolbar from './components/x-toolbar'
import ToolCell from './components/x-toolbar/tool-cell'
import SelectGroup from './components/select-group'
import SortGroup from './components/sort-group'
import Dropdown from './components/dropdown'
import StatusCell from './components/status-cell'
import TimeoutCell from './components/timeout-cell'
import XSelect from './components/x-select'

//directives
import TransferDom from './directives/transfer-dom'
import ClickOutside from './directives/click-outside'
import Inview from './directives/inview'
import Ripple from './directives/ripple'

//plugins
import BusPlugin from './plugins/bus/index.js'

//mixins
import checkLogin from './mixins/check-login'

//filters
import quick3Sum from './filters/quick3-sum'
import twoSideType from './filters/two-side-type'
import formatOpenNum from './filters/format-open-num'
import formatCouponType from './filters/format-coupon-type'
import formatCoupon from './filters/format-coupon'
import formatCouponStatus from './filters/format-coupon-status'
import formatOptionals from './filters/format-optionals'

export {
  //components
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
  XToolbar,
  ToolCell,
  SelectGroup,
  SortGroup,
  Dropdown,
  StatusCell,
  TimeoutCell,
  XSelect,
  Tooltip,


  //directives
  TransferDom,
  ClickOutside,
  Inview,
  Ripple,


  //plugins
  BusPlugin,

  //mixins
  checkLogin,

  //filters
  formatCouponType,
  formatOpenNum,
  formatCouponStatus,
  quick3Sum,
  twoSideType,
  formatCoupon,
  formatOptionals,

}
