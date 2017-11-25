

const ClientView = Base.ItemView.extend({

  template: require('./index.html'),

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./css/main.scss', './css/basic.scss'], (require) => {
      require('./css/main.scss')
      require('./css/basic.scss')
      $('body').removeClass('hidden')
    })
  },

  onRender() {
    const self = this
    if (window.Modernizr.csstransforms) {
      require.ensure(['./js/turn.js'], (require) => {
        require('./js/turn.js')
        self.loadApp()
        self.loadPage()
      })
    } else {
      require.ensure(['./js/turn.html4.min.js'], (require) => {
        require('./js/turn.html4.min.js')
        self.loadApp()
        self.loadPage()
      })
    }


    // Load the HTML4 version if there's not CSS transform


    // yepnope({
    //   test: Modernizr.csstransforms,
    //   yep: ['js/turn.js'],
    //   nope: ['js/turn.html4.min.js'],
    //   both: ['css/basic.css'],
    //   complete: loadApp
    // });
  },

  loadPage() {
    // var clear_bobble = setInterval(function(){
    //   if($("div:eq(3)").is(":hidden")){
    //     clearInterval(clear_bobble);
    //     $(".bobble").hide();
    //   }
    // },500);


    // $("div:eq(10)").append("<div class='touch'><img src="+require('./pics/submit.png')+" width='166' height='38' alt=''></div><div class='footer_pic'></div><div class='touch_info'></div>");
    // var $touch = $(".touch");
    // $touch.on("click", function () {
    //   $(this).hide();
    //   $(".footer_pic").show();
    //   $(".touch_info").show();
    // });

    const $title = $('.title img')

    function titleAnimate() {
      let srcStr
      let num = 1
      let clear_id
      clear_id = setInterval(() => {
        srcStr = require(`./pics/luster_${num}.png`)
        $title.attr('src', srcStr)
        num++
        if (num > 23) {
          num = 1
          clearInterval(clear_id)
          setTimeout(titleAnimate, 700)
        }
      }, 60)
    }

    titleAnimate()
  },

  loadApp() {
    // Create the flipbook
    $('.flipbook').turn({
      // Width

      width: 922,

      // Height

      height: 600,

      // Elevation

      elevation: 50,

      // Enable gradients

      gradients: true,

      // Auto center this flipbook

      autoCenter: true,

    })
  },


})

$('.js-package').html(new ClientView().render().$el)
$('body').css('background-color', '#fff')
