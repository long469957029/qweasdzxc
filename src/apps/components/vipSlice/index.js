

require('./style.scss')
// require("./jquery-1.10.2");
// require('./effect');

const vipSlice = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .close_btn': 'offHandel',
    'click .vip-btn': 'offHandel',
  },

  onRender() {
    const self = this
    // var storage=window.localStorage;
    // storage.setItem("c",1);
  },

  showFire () {
    setTimeout(() => {
      $('.fire_01').addClass('fire_01_ani')
    }, 1000)
    setTimeout(() => {
      $('.fire_02').addClass('fire_02_ani')
    }, 1200)
    setTimeout(() => {
      $('.text_01').addClass('text_01_ani')
    }, 1400)
    setTimeout(() => {
      $('.text_02').addClass('text_02_ani')
    }, 1600)
    setTimeout(() => {
      $('.vip-btn').addClass('btn_ani')
    }, 1800)
  },

  offHandel (argument) {
    $('.mask').remove('.mask')
  },

  test () {
    const $close_btn = $('.close_btn')
    $close_btn.click(() => {
      $('.mask').hide()
    })

    const $main = $('.main_contain')
    const $qq_pop = $('.qq_pop')
    const $qq_signature_pop = $('.qq_signature_pop')
    const $friend_pop = $('.friend_pop')
    const $other_pop = $('.other_pop')

    const $qq_btn = $('.qq_btn')
    const $qq_signature_btn = $('.qq_signature_btn')
    const $friend_btn = $('.friend_btn')
    const $other_btn = $('.other_btn')

    const $tab_btn = $('.wxfx_tab_menu li')
    const $select_ele = $('.select_ele')
    const $return_btn = $('.return_btn')
    const $btn_copy = $('.btn_copy')
    const $copy_success = $('.copy_success')

    $tab_btn.click(function () {
      const num = $tab_btn.index($(this))
      $tab_btn.removeClass('active')
      $(this).addClass('active')

      $select_ele.hide()
      $select_ele.eq(num).show()
    })

    $qq_btn.click(() => {
      $main.hide()
      $qq_pop.show()
    })
    $qq_signature_btn.click(() => {
      $main.hide()
      $qq_signature_pop.show()
    })
    $friend_btn.click(() => {
      $main.hide()
      $friend_pop.show()
    })
    $other_btn.click(() => {
      $main.hide()
      $other_pop.show()
    })

    $return_btn.click(function () {
      $(this).parent().hide()
      $main.show()
    })

    $btn_copy.click(() => {
      $copy_success.show()
      setTimeout(() => {
        $copy_success.hide()
      }, 1000)
    })

    const $file_btn = $('.pic_select_lump>ul>li>input')

    const $btn_sub = $('.btn_sub')
    const $btn_cancel = $('.btn_cancel')
    const $bg_lump_01 = $('.bg_lump').eq(0)
    const $bg_lump_02 = $('.bg_lump').eq(1)

    $btn_sub.click(() => {
      $bg_lump_01.hide()
      $bg_lump_02.show()
    })
    $btn_cancel.click(() => {
      $bg_lump_01.show()
      $bg_lump_02.hide()
    })
  },

})

module.exports = vipSlice
