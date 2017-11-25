(function($) {
  $.fn.extend({
    setRoll() {
      function rolling() {
        $ul.animate({
          top: '-23px',
        }, 500, () => {
          $ul.css('top', '0px')
          $ul.find('li:eq(0)').appendTo($ul)
        })
      }
      var $ul = this
						
      return this.each((index) => {
        setInterval(rolling, 3000)
      })
    },
  })
	
  $.fn.extend({
    closeBtn() {
      const $btns = $('.btn_click')
      const $closeBtn = $('.close_icon')
      const $btn_05 = $('.btn_05')
      const $cloud_pic = $('.cloud_pic')
      const $cloud_lump = $('.full_screen,.cloud_pic')
      const window_height = $(window).innerHeight() / 2
      const window_width = $(window).width() / 2
	
      $cloud_pic.css({
        left: `${window_width - $cloud_pic.width() / 2}px`,
        top: `${window_height - $cloud_pic.height() / 2 + $(window).scrollTop()}px`,
      })
			
      return this.each(() => {
        $btns.click(() => {
          $cloud_lump.css('display', 'block')
          console.log($(window).scrollTop())
          $cloud_pic.css({
            left: `${window_width - $cloud_pic.width() / 2}px`,
            top: `${window_height - $cloud_pic.height() / 2 + $(window).scrollTop()}px`,
          })
        })
        $btn_05.click(() => {
          $cloud_lump.css('display', 'none')
        })
        $closeBtn.click(() => {
          $cloud_lump.css('display', 'none')
        })
      })
    },
  })
}(jQuery))
