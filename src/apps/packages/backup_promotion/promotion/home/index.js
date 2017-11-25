/**
 * Created by Administrator on 2016/12/12.
 */


const HomeView = Base.ItemView.extend({

  template: require('./index.html'),

  // initialize: function() {
  //     // $('body').addClass('hidden');
  //     require.ensure(['./css/year_celebratemain.scss','./css/year_celebratebasic.scss'], function(require) {
  //         require('./css/year_celebratemain.scss');
  //         require('./css/year_celebratebasic.scss');
  //         // $('body').removeClass('hidden');
  //     });
  //
  // },

  onRender() {
    const self = this


    if (window.Modernizr.csstransforms) {
      require.ensure(['./js/year_celebrate/effect.js'], (require) => {
        require('./js/year_celebrate/effect.js')
        self.loadApp()
        self.loadPage()
      })
    }

    // else{
    //     require.ensure(['./js/year_celebrate/turn.html4.min.js'], function(require) {
    //         require('./js/year_celebrate/turn.html4.min.js');
    //         self.loadApp();
    //         self.loadPage();
    //     });
    // }

    // if(window.Modernizr.csstransforms){
    //     require.ensure(['./js/year_celebrate/effect_02.js'], function(require) {
    //         require('./js/year_celebrate/effect_02.js')
    //         self.loadApp();
    //         self.loadPage()
    //     });
    // }
    // else{
    //     require.ensure(['./js/year_celebrate/turn.html4.min.js'], function(require) {
    //         require('./js/year_celebrate/turn.html4.min.js');
    //         self.loadApp();
    //         self.loadPage();
    //     });
    // }

    // Load the HTML4 version if there's not CSS transform


    // yepnope({
    //   test: Modernizr.csstransforms,
    //   yep: ['js/effect_02.js'],
    //   nope: ['js/turn.html4.min.js'],
    //   both: ['css/basic.css'],
    //   complete: loadApp
    // });
  },

  // loadPage: function(){
  //     // var clear_bobble = setInterval(function(){
  //     //   if($("div:eq(3)").is(":hidden")){
  //     //     clearInterval(clear_bobble);
  //     //     $(".bobble").hide();
  //     //   }
  //     // },500);
  //
  //
  //     // $("div:eq(10)").append("<div class='touch'><img src="+require('./pics/submit.png')+" width='166' height='38' alt=''></div><div class='footer_pic'></div><div class='touch_info'></div>");
  //     // var $touch = $(".touch");
  //     // $touch.on("click", function () {
  //     //   $(this).hide();
  //     //   $(".footer_pic").show();
  //     //   $(".touch_info").show();
  //     // });
  //
  //     var $title = $(".title img");
  //
  //     function titleAnimate() {
  //         var srcStr;
  //         var num = 1;
  //         var clear_id;
  //         clear_id = setInterval(function () {
  //             srcStr = require("./pics/luster_" + num + ".png");
  //             $title.attr("src", srcStr);
  //             num++;
  //             if (num > 23) {
  //                 num = 1;
  //                 clearInterval(clear_id);
  //                 setTimeout(titleAnimate,700);
  //             }
  //         }, 60);
  //     }
  //
  //     titleAnimate();
  // },

  // loadApp:function() {
  //
  //     // Create the flipbook
  //     $('.flipbook').turn({
  //         // Width
  //
  //         width: 922,
  //
  //         // Height
  //
  //         height: 600,
  //
  //         // Elevation
  //
  //         elevation: 50,
  //
  //         // Enable gradients
  //
  //         gradients: true,
  //
  //         // Auto center this flipbook
  //
  //         autoCenter: true
  //
  //     });
  // }


})

$('.js-package').html(new HomeView().render().$el)
$('body').css('background-color', '#fff')

//  * Created by Administrator on 2016/12/12.
//  */
// <script src="js/jquery-1.10.2.js"></script>
//     <script src="js/jquery.mousewheel.js"></script>
//     <script src="js/year_celebrate/effect.js"></script>
//     <script src="js/createjs-2015.11.26.min.js"></script>
//     <script src="js/effect_01.js"></script>
//     <script src="js/effect_02.js"></script>
//     <script>
// var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
// function page_animate_01() {
//     canvas = document.getElementsByName("canvas")[0];
//     anim_container = document.getElementById("animation_container_01");
//     dom_overlay_container = document.getElementById("dom_overlay_container_01");
//     images_01 = images_01 || {};
//     var loader = new createjs.LoadQueue(false);
//     loader.addEventListener("fileload", handleFileLoad_01);
//     loader.addEventListener("complete", handleComplete_01);
//     loader.loadManifest(lib_01.properties.manifest);
// }
// function handleFileLoad_01(evt) {
//     if (evt.item.type == "image") {
//         images_01[evt.item.id] = evt.result;
//     }
// }
// function handleComplete_01(evt) {
//     //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
//     var queue = evt.target;
//     var ssMetadata = lib_01.ssMetadata;
//     for (i = 0; i < ssMetadata.length; i++) {
//         ss_01[ssMetadata[i].name] = new createjs.SpriteSheet({
//             "images": [queue.getResult(ssMetadata[i].name)],
//             "frames": ssMetadata[i].frames
//         })
//     }
//     exportRoot = new lib_01.effect_01();
//     stage = new createjs.Stage(canvas);
//     stage.addChild(exportRoot);
//     //Registers the "tick" event listener.
//     fnStartAnimation = function () {
//         createjs.Ticker.setFPS(lib_01.properties.fps);
//         createjs.Ticker.addEventListener("tick", stage);
//     }
//     //Code to support hidpi screens and responsive scaling.
//     function makeResponsive(isResp, respDim, isScale, scaleType) {
//         var lastW, lastH, lastS = 1;
//         window.addEventListener('resize', resizeCanvas);
//         resizeCanvas();
//         function resizeCanvas() {
//             var w = lib_01.properties.width, h = lib_01.properties.height;
//             var iw = window.innerWidth, ih = window.innerHeight;
//             var pRatio = window.devicePixelRatio || 1, xRatio = iw / w, yRatio = ih / h, sRatio = 1;
//             if (isResp) {
//                 if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
//                     sRatio = lastS;
//                 }
//                 else if (!isScale) {
//                     if (iw < w || ih < h)
//                         sRatio = Math.min(xRatio, yRatio);
//                 }
//                 else if (scaleType == 1) {
//                     sRatio = Math.min(xRatio, yRatio);
//                 }
//                 else if (scaleType == 2) {
//                     sRatio = Math.max(xRatio, yRatio);
//                 }
//             }
//             canvas.width = w * pRatio * sRatio;
//             canvas.height = h * pRatio * sRatio;
//             canvas.style.width = dom_overlay_container.style.width = anim_container.style.width = w * sRatio + 'px';
//             canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = h * sRatio + 'px';
//             stage.scaleX = pRatio * sRatio;
//             stage.scaleY = pRatio * sRatio;
//             lastW = iw;
//             lastH = ih;
//             lastS = sRatio;
//         }
//     }
//
//     makeResponsive(false, 'both', false, 1);
//     fnStartAnimation();
// }
//
// function page_animate_02() {
//     canvas = document.getElementsByName("canvas")[1];
//     anim_container = document.getElementById("animation_container_02");
//     dom_overlay_container = document.getElementById("dom_overlay_container_02");
//     images = images || {};
//     ss = ss || {};
//     var loader = new createjs.LoadQueue(false);
//     loader.addEventListener("fileload", handleFileLoad_02);
//     loader.addEventListener("complete", handleComplete_02);
//     loader.loadManifest(lib.properties.manifest);
// }
// function handleFileLoad_02(evt) {
//     if (evt.item.type == "image") {
//         images[evt.item.id] = evt.result;
//     }
// }
// function handleComplete_02(evt) {
//     //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
//     var queue = evt.target;
//     var ssMetadata = lib.ssMetadata;
//     for (i = 0; i < ssMetadata.length; i++) {
//         ss[ssMetadata[i].name] = new createjs.SpriteSheet({
//             "images": [queue.getResult(ssMetadata[i].name)],
//             "frames": ssMetadata[i].frames
//         })
//     }
//     exportRoot = new lib.effect_02();
//     stage = new createjs.Stage(canvas);
//     stage.addChild(exportRoot);
//     //Registers the "tick" event listener.
//     fnStartAnimation = function () {
//         createjs.Ticker.setFPS(lib.properties.fps);
//         createjs.Ticker.addEventListener("tick", stage);
//     }
//     //Code to support hidpi screens and responsive scaling.
//     function makeResponsive(isResp, respDim, isScale, scaleType) {
//         var lastW, lastH, lastS = 1;
//         window.addEventListener('resize', resizeCanvas);
//         resizeCanvas();
//         function resizeCanvas() {
//             var w = lib.properties.width, h = lib.properties.height;
//             var iw = window.innerWidth, ih = window.innerHeight;
//             var pRatio = window.devicePixelRatio || 1, xRatio = iw / w, yRatio = ih / h, sRatio = 1;
//             if (isResp) {
//                 if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
//                     sRatio = lastS;
//                 }
//                 else if (!isScale) {
//                     if (iw < w || ih < h)
//                         sRatio = Math.min(xRatio, yRatio);
//                 }
//                 else if (scaleType == 1) {
//                     sRatio = Math.min(xRatio, yRatio);
//                 }
//                 else if (scaleType == 2) {
//                     sRatio = Math.max(xRatio, yRatio);
//                 }
//             }
//             canvas.width = w * pRatio * sRatio;
//             canvas.height = h * pRatio * sRatio;
//             canvas.style.width = dom_overlay_container.style.width = anim_container.style.width = w * sRatio + 'px';
//             canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = h * sRatio + 'px';
//             stage.scaleX = pRatio * sRatio;
//             stage.scaleY = pRatio * sRatio;
//             lastW = iw;
//             lastH = ih;
//             lastS = sRatio;
//         }
//     }
//
//     makeResponsive(false, 'both', false, 1);
//     fnStartAnimation();
// }
// </script>
