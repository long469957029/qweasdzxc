export const CHECKOUT_TICKET_INFO = 'CHECKOUT_TICKET_INFO'
export const GO_TO_NEXT_PLAN = 'GO_TO_NEXT_PLAN'
export const CHECKOUT_TICKET_RULES = 'CHECKOUT_TICKET_RULES'

export const GET_TICKET_INFO = 'GET_TICKET_INFO'
export const GET_MMC_TICKET_INFO = 'GET_MMC_TICKET_INFO'
export const GET_TICKET_RULES = 'GET_TICKET_RULES'

// bettingChoice
export const RESET_BETTING_CHOICE = 'RESET_BETTING_CHOICE'
export const SET_LEVEL = 'SET_LEVEL'
export const SET_PLAY = 'SET_PLAY'
export const SET_MAX_BONUS = 'SET_MAX_BONUS'
export const SET_MULTIPLE = 'SET_MULTIPLE'
export const SET_UNIT = 'SET_UNIT'
export const SET_STATISTICS = 'SET_STATISTICS'
export const SET_MAX_PRIZE_MULTIPLE = 'SET_MAX_PRIZE_MULTIPLE'
export const SET_PLAY_INFO = 'SET_PLAY_INFO'
export const SET_CHECKOUT_CHOICE = 'SET_CHECKOUT_CHOICE'
export const UPDATE_FORMAT_MAX_MULTIPLE = 'UPDATE_FORMAT_MAX_MULTIPLE'
export const UPDATE_BONUS = 'UPDATE_BONUS'

export const ADD_PREV_BET = 'ADD_PREV_BET'
export const ADD_HANDICAP_BET = 'ADD_HANDICAP_BET'
export const ADD_HANDICAP_BETS = 'ADD_HANDICAP_BETS'

export const EMPTY_PREV_BETTING = 'EMPTY_PREV_BETTING'
export const EMPTY_BUY_BETTING = 'EMPTY_BUY_BETTING'
export const ADD_BETS = 'ADD_BETS'
export const SET_CHOICE_EMPTY = 'SET_CHOICE_EMPTY'
export const EMPTY_CHOICE = 'EMPTY_CHOICE'
export const SET_PREVIEW_MULTIPLE = 'SET_PREVIEW_MULTIPLE'
export const SET_LIMIT_MONEY = 'SET_LIMIT_MONEY'
export const CHANGE_PREV_BETTING = 'CHANGE_PREV_BETTING'
export const CALCULATE_TOTAL = 'CALCULATE_TOTAL'
export const GET_CHASE_PLANS = 'GET_CHASE_PLANS'
export const KICK_CHASE_PLANS = 'KICK_CHASE_PLANS'
export const EMPTY_CHASE_PLANS = 'EMPTY_CHASE_PLANS'
export const SET_CLAMP_BONUS = 'SET_CLAMP_BONUS'

export const GET_VOUCHERS = 'GET_VOUCHERS'
export const GET_VOUCHERS_SUCCESS = 'GET_VOUCHERS_SUCCESS'
export const CHECKOUT_VOUCHERS = 'CHECKOUT_VOUCHERS'
export const SELECTED_VOUCHERS = 'SELECTED_VOUCHERS'

export const GET_TICKET_INFO_SUCCESS = 'GET_TICKET_INFO_SUCCESS'
export const GET_TICKET_INFO_FAILURE = 'GET_TICKET_INFO_FAILURE'
export const CHECKOUT_PLAN_ID = 'CHECKOUT_PLAN_ID'

export const GET_TICKET_RULES_SUCCESS = 'GET_TICKET_RULES_SUCCESS'
export const GET_TICKET_RULES_FAILURE = 'GET_TICKET_RULES_FAILURE'

export const PUSH_MMC_BETTING = 'PUSH_MMC_BETTING'
export const PUSH_MMC_BETTING_SUCCESS = 'PUSH_MMC_BETTING_SUCCESS'
export const PUSH_MMC_BETTING_FAILURE = 'PUSH_MMC_BETTING_FAILURE'

export const PUSH_BETTING = 'PUSH_BETTING'
export const PUSH_BETTING_SUCCESS = 'PUSH_BETTING_SUCCESS'
export const PUSH_BETTING_FAILURE = 'PUSH_BETTING_FAILURE'

export const GET_CHASE_PLANS_SUCCESS = 'GET_CHASE_PLANS_SUCCESS'
export const GET_CHASE_PLANS_FAILURE = 'GET_CHASE_PLANS_FAILURE'

export const PUSH_CHASE = 'PUSH_CHASE'
export const PUSH_CHASE_SUCCESS = 'PUSH_CHASE_SUCCESS'
export const PUSH_CHASE_FAILURE = 'PUSH_CHASE_FAILURE'

// 冷热遗漏
export const CHECK_OUT_COLD_HOT = 'CHECK_OUT_COLD_HOT'
export const CHECK_OUT_CURRENT_MISS = 'CHECK_OUT_CURRENT_MISS'
export const GET_COLD_HOT = 'GET_COLD_HOT'
export const GET_CURRENT_MISS = 'GET_CURRENT_MISS'
export const GET_COLD_HOT_SUCCESS = 'GET_COLD_HOT_SUCCESS'
export const GET_CURRENT_MISS_SUCCESS = 'GET_CURRENT_MISS_SUCCESS'

//mark6
export const GET_MARK6_SX = 'GET_MARK6_SX'
export const GET_MARK6_SX_SUCCESS = 'GET_MARK6_SX_SUCCESS'

//topTickets
export const GET_TOP_TICKETS = 'GET_TOP_TICKETS'
export const GET_TOP_TICKETS_SUCCESS = 'GET_TOP_TICKETS_SUCCESS'
export const GET_TOP_TICKETS_FAILURE = 'GET_TOP_TICKETS_FAILURE'
export const TOGGLE_TOP_TICKETS_BY_TYPE = 'TOGGLE_TOP_TICKETS_BY_TYPE'

export const SET_TOP_CURRENT_TICKET = 'SET_TOP_CURRENT_TICKET'
export const SET_TOP_CURRENT_TICKET_SUCCESS = 'SET_TOP_CURRENT_TICKET_SUCCESS'
export const SET_TOP_CURRENT_TICKET_FAILURE = 'SET_TOP_CURRENT_TICKET_FAILURE'
export const RESORT_TOP_TICKETS = 'RESORT_TOP_TICKETS'
export const __RESORT_TOP_TICKETS = '__RESORT_TOP_TICKETS'
export const ACTIVE_TOP_TICKETS = 'ACTIVE_TOP_TICKETS'
export const __ACTIVE_TOP_TICKETS = '__ACTIVE_TOP_TICKETS'

// 用户登录相关
export const USER_CLEAR = 'USER_CLEAR'
export const USER_OAUTH_SUCCESS = 'USER_OAUTH_SUCCESS'
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
export const USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS'
export const TOGGLE_DO_LOGOUT = 'TOGGLE_DO_LOGOUT'
export const DO_LOGOUT = "DO_LOGOUT"
export const COMMIT_USER_TOKEN = 'COMMIT_USER_TOKEN'
export const USER_IS_VIP = 'USER_IS_VIP'
export const CHECK_LOGIN_STATUS = 'CHECK_LOGIN_STATUS'
export const USER_SECURITY_INFO = 'USER_SECURITY_INFO'

// 全局弹窗相关
export const TOGGLE_LOGIN_DIALOG = 'TOGGLE_LOGIN_DIALOG'
export const TOGGLE_LOGOUT_DIALOG = 'TOGGLE_LOGOUT_DIALOG'
export const TOGGLE_LOGOUT_NOTICE = 'TOGGLE_LOGOUT_NOTICE'//登出弹窗提示
export const TOGGLE_RESET_PASSWORD_DIALOG = 'TOGGLE_RESET_PASSWORD_DIALOG'
export const TOGGLE_LOGIN_LAUNCHER = 'TOGGLE_LOGIN_LAUNCHER' // 急速登录器
export const TOGGLE_FREE_TRIAL = 'TOGGLE_FREE_TRIAL' //免费试玩
export const TOGGLE_RESET_INIT_PWD = 'TOGGLE_RESET_INIT_PWD' // 首次登陆修改密码
export const TOGGLE_GMAE_DOWN_LOAD = 'TOGGLE_GMAE_DOWN_LOAD' //第三方游戏手机端下载弹窗
export const TOGGLE_NOVICE_PACKAGE = 'TOGGLE_NOVICE_PACKAGE' // 新手礼包弹窗
export const TOGGLE_DESKTOP_MESSAGE = 'TOGGLE_DESKTOP_MESSAGE' //桌面消息通知
export const TOGGLE_IM_DIALOG = 'TOGGLE_IM_DIALOG' //站内消息弹窗

//试玩开关
export const SET_REQUEST_FROM_TEST_SERVER = 'SET_REQUEST_FROM_TEST_SERVER'

//商城
export const GET_USER_MALL_INFO = 'GET_USER_MALL_INFO'
export const GET_USER_MALL_INFO_SUCCESS = 'GET_USER_MALL_INFO_SUCCESS'

// 站内信
export const GET_IM_RECENTLY_CONTACT = 'GET_IM_RECENTLY_CONTACT' // 获取近期联系人列表
export const GET_IM_RECENTLY_CONTACT_SUCCESS = 'GET_IM_RECENTLY_CONTACT_SUCCESS' // 获取近期联系人列表成功，处理数据
export const GET_IN_CONTACT = 'GET_IN_CONTACT' // 获取联系人列表
export const GET_IN_CONTACT_SUCCESS = 'GET_IN_CONTACT_SUCCESS' // 获取联系人列表成功，处理数据
export const TOGGLE_IM_CONTACT_PANEL = 'TOGGLE_IM_CONTACT_PANEL' // 判断显示左侧联系人面板
export const CONTACT_SEARCH_NAME = 'CONTACT_SEARCH_NAME' // 提交联系人搜索框数据
export const CLEAR_CONTACT_SEARCH_NAME = 'CLEAR_CONTACT_SEARCH_NAME' // 清空联系人搜索框数据
export const TOGGLE_MESSAGE_PANEL = 'TOGGLE_MESSAGE_PANEL' // 判断显示右侧消息面板
export const UPDATE_CONTACT_USER_INFO = 'UPDATE_CONTACT_USER_INFO' // 更新当前聊天对象信息
export const CLEAR_IM_PROCESS = 'CLEAR_IM_PROCESS' // 清空站内信进程及数据
export const GET_MESS_CONTACT = 'GET_MESS_CONTACT' // 获取群聊联系人信息
export const UPDATE_MESS_CONTACT = 'UPDATE_MESS_CONTACT' // 更新群聊联系人信息
export const TOGGLE_MESS_CONTACT_PANEL = 'TOGGLE_MESS_CONTACT_PANEL' // 打开群聊联系人面板
export const ADD_MESS_CONTACT = 'ADD_MESS_CONTACT' // 群聊选中联系人
export const CLICK_MESS_SELECT_PANEL_OUTSIDE = 'CLICK_MESS_SELECT_PANEL_OUTSIDE' // 点击群聊联系人选择外部区域事件
export const CLICK_OPEN_MESS_CONTACT_PANEL = 'CLICK_OPEN_MESS_CONTACT_PANEL' // 点击按钮显示群聊联系人面板事件
export const GET_IM_CONTACT_CHAT = 'GET_IM_CONTACT_CHAT' // 获取联系人聊天内容
export const GET_IM_CONTACT_CHAT_SUCCESS = 'GET_IM_CONTACT_CHAT_SUCCESS' // 获取联系人聊天内容成功
export const GET_IM_MESS_CHAT = 'GET_IM_MESS_CHAT' // 获取联系人群聊内容
export const GET_IM_MESS_CHAT_SUCCESS = 'GET_IM_MESS_CHAT_SUCCESS' // 获取联系人群聊内容成功
export const SEND_PEASONAL_CHAT = 'SEND_PEASONAL_CHAT' // 发送私聊消息
export const SEND_PEASONAL_CHAT_SUCCESS = 'SEND_PEASONAL_CHAT_SUCCESS' // 发送私聊消息
export const SEND_MESS_CHAT = 'SEND_MESS_CHAT' // 发送群聊消息
export const SEND_MESS_CHAT_SUCCESS = 'SEND_MESS_CHAT_SUCCESS' // 发送群聊消息成功
export const CREATE_MESS_GROUP = 'CREATE_MESS_GROUP' // 创建群聊组
export const CREATE_MESS_GROUP_SUCCESS = 'CREATE_MESS_GROUP_SUCCESS' // 创建群聊组成功
export const CLOSE_RENCENTLY_RECORD = 'CLOSE_RENCENTLY_RECORD' // 删除近期聊天
export const CLOSE_RENCENTLY_RECORD_SUCCESS = 'CLOSE_RENCENTLY_RECORD_SUCCESS' // 删除近期聊天
export const IS_SEND = 'IS_SEND' //发送消息

// 个人中心


export const TRACKING_USER = 'TRACKING_USER' //tracking用户信息

//wechatmessage  微信投注
export const UPDATE_DATACHED_MESSAGE_LIST = 'UPDATE_DATACHED_MESSAGE_LIST'//更新store中未持久的信息列表

//sentry数据行为
export const SEND_USER_INFO = 'SEND_USER_INFO'
