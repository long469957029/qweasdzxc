<template>
  <div class="personal-Sidebar">
    <a href="#/ac/to" class="team-entry">切换团队中心
      <span class="sfa sfa-icon-arrow-down"></span>
      <span class="sfa sfa-icon-arrow-down"></span>
    </a>
    <div class="sidebar-user-info clearfix">
      <div class="user-info-photo">
        <img :src="userAvatar"/>
      </div>
      <div class="user-info-name text-inverse text-center m-top-sm font-sm">您好，{{username}}</div>
      <div class="m-top-smd text-center">
        <a href="#/uc/pl" class="sfa m-right-xs"
           :class="{'sfa-icon-lock':!hasFundPassword,'sfa-icon-lock-over':hasFundPassword}"></a>
        <a href="#/uc/pl" class="sfa m-right-xs"
           :class="{'sfa-icon-light-bulb':!hasSecurityQuestion,'sfa-icon-light-bulb-over':hasSecurityQuestion}"></a>
        <a href="#/uc/pl" class="sfa m-right-xs"
           :class="{'sfa-icon-mobile':!hasBindingMobile,'sfa-icon-mobile-over':hasBindingMobile}"></a>
        <a href="#/uc/pl" class="sfa m-right-xs"
           :class="{'sfa-icon-mail':!hasBindingEmail,'sfa-icon-mail-over':hasBindingEmail}"></a>
      </div>
      <div class="user-info-safe text-center">
        <span>账户安全：</span>
        <div class="safe-progress-bg inline-block">
          <div class="safe-progress-bar " :style="{width:processWidth}"></div>
        </div>
        <span>{{safeLevel}}></span>
        <span class="user-info-safe-up text-inverse m-left-sm">提升&gt;</span>
      </div>
    </div>
    <template v-for="module in moduleList">
      <div class="sidebar-sub-title">
        <span class="sfa vertical-middle" :class="module.icon"></span>{{module.title}}
      </div>
      <ul class="sidebar-list">
        <router-link role="presentation" v-for="item in module.child"
                     :class="{active:item.id===currentView}" :to="{name: item.name}" tag="li" :key="item.id">{{item.title}}
        </router-link>
      </ul>
    </template>
    <!--<div class="sidebar-title">-->
    <!--<div class="sidebar-title-inner">-->
    <!--<span class="sfa sfa-sidebar-<%=menus.icon %> block m-center m-bottom-sm"></span>-->
    <!--<%=menus.name %>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="sidebar-sub-title">-->
    <!--<span class="sfa sfa-sidebar-<%=item.icon%> vertical-middle"></span>-->
    <!--</div>-->
    <!--<ul class="sidebar-list">-->
    <!--<li role="presentation" class="<% if (menu.isActive) { %>active<% } %>">-->
    <!--<a class="router" href="">-->
    <!--<span class="js-ac-dm-tip ac-dm-tip">待签约</span>-->
    <!--<span class="js-my-points text-hot"><%=myPointsNoUse%></span>-->
    <!--</a>-->
    <!--</li>-->
    <!--</ul>-->
  </div>
</template>
<script>
  import menuConfList from './personalMenuConf'
  export default{
    name: 'personalSideBar',

    data () {
      return {
        hasFundPassword: false,
        hasSecurityQuestion: false,
        hasBindingMobile: false,
        hasBindingEmail: false,
        safeLevel: '低',
        processWidth: 0,
        moduleList: [],
        currentView: 101,
      }
    },

    props: {},

    components: {},

    mounted () {
      const accountSafe = this.userSecurityInfo
      if (accountSafe) {
        this.hasFundPassword = accountSafe.hasFundPassword
        this.hasSecurityQuestion = accountSafe.hasSecurityQuestion
        this.hasBindingMobile = accountSafe.hasBindingMobile
        this.hasBindingEmail = accountSafe.hasBindingEmail
        if (accountSafe && accountSafe.securityLevel < 3) {
          this.safeLevel = '低'
        } else if (accountSafe && accountSafe.securityLevel < 5) {
          this.safeLevel = '中'
        } else {
          this.safeLevel = '高'
        }
        this.processWidth = _(_(accountSafe.securityLevel).div(5)).mul(100) + '%'
      }
      this.moduleList = menuConfList.getAll()
    },


    watch: {},

    computed: {
      ...mapGetters([
        'userAvatar',
        'username',
        'userSecurityInfo'
      ])
    },

    filters: {},

    methods: {}
  }
</script>

<style scoped lang="scss">
  @import "~base/styles/imports";

  .personal-Sidebar {
    min-height: 800px;
    background-color: #f8f8f8;
    color: #666666;
    position: relative;
    .team-entry {
      position: absolute;
      width: 18px;
      background-color: #14b1bb;
      color: #ffffff;
      font-size: 14px;
      top: 18px;
      left: -33px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      cursor: pointer;
      padding: 15px 7.5px;
      writing-mode: vertical-lr;
      -webkit-writing-mode: vertical-lr;
      -ms-writing-mode: vertical-lr;
      .sfa {
        &:first-child {
          position: relative;
          top: 5px;
          animation: arrow-down .8s infinite;
          opacity: 0;
        }
        &:last-child {
          position: relative;
          top: -3px;
          opacity: 0;
          animation: arrow-down .8s .4s infinite;
        }
      }
    }
    .sidebar-user-info {
      width: 100%;
      height: 245px;
      border-bottom: 1px solid #e6e6e6;
      .user-info-photo {
        display: block;
        width: 81px;
        height: 82px;
        border-radius: 50%;
        line-height: 79px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 5px;
        box-shadow: 0 0 5px #cbcbcb;
        margin-top: 27px;
      }
      .user-info-safe {
        margin-top: 10px;
      }
      .user-info-safe-up {
        cursor: pointer;
      }
      .safe-progress-bg {
        width: 42px;
        height: 6px;
        background-color: #ffffff;
        position: relative;
        vertical-align: middle;
        .safe-progress-bar {
          position: absolute;
          height: 6px;
          width: 30%;
          background-color: #f09932;
        }
      }
    }
    .sidebar-sub-title {
      width: 100%;
      height: 45px;
      line-height: 45px;
      font-size: $font-sm;
      color: $main-deep-color;
      text-align: center;
      font-weight: bold;
      transform: translateX(-10px);
      .sfa {
        transform: translateY(-2px);
        margin-right: 4px;
      }
    }
    .sidebar-list {
      font-weight: normal;
      > li {
        //padding: 0 20px;
        margin-bottom: -1px;
        list-style: none;
        position: relative;
        color: #666666;
        font-size: 14px;
        line-height: 40px;
        display: block;
        text-align: center;
        cursor: pointer;
        .vip {
          display: block;
        }
        .sfa-sidebar-chevron-right {
          float: right;
          margin: 17px 0;
        }

        &.active {
          width: 100.5%;
          background-color: #ffffff;
          border-top: 1px solid #e6e6e6;
          border-bottom: 1px solid #e6e6e6;
          &:before {
            content: '';
            width: 3px;
            height: 40px;
            background-color: #14b1bb;
            position: absolute;
            top: 0;
            left: 0;
          }
          > a {
            font-weight: bold;
            border-bottom-color: transparent;
          }

          ~ li {
            margin-bottom: -1px;
          }
        }
      }
    }
  }
</style>

