(function (lib, img, cjs, ss, an) {
  let p // shortcut to reference prototypes
  lib.ssMetadata = [
    { name: 'effect_01_atlas_', frames: [[826, 646, 522, 100], [1634, 646, 137, 74], [1350, 646, 145, 84], [1497, 646, 135, 87], [0, 0, 1295, 579], [1297, 0, 646, 644], [0, 581, 824, 208]] },
  ];


  // symbols:


  (lib.des_01 = function() {
    this.spriteSheet = ss.effect_01_atlas_
    this.gotoAndStop(0)
  }).prototype = p = new cjs.Sprite();


  (lib.des_02 = function() {
    this.spriteSheet = ss.effect_01_atlas_
    this.gotoAndStop(1)
  }).prototype = p = new cjs.Sprite();


  (lib.des_03 = function() {
    this.spriteSheet = ss.effect_01_atlas_
    this.gotoAndStop(2)
  }).prototype = p = new cjs.Sprite();


  (lib.des_04 = function() {
    this.spriteSheet = ss.effect_01_atlas_
    this.gotoAndStop(3)
  }).prototype = p = new cjs.Sprite();


  (lib.luster_01 = function() {
    this.spriteSheet = ss.effect_01_atlas_
    this.gotoAndStop(4)
  }).prototype = p = new cjs.Sprite();


  (lib.luster_02 = function() {
    this.spriteSheet = ss.effect_01_atlas_
    this.gotoAndStop(5)
  }).prototype = p = new cjs.Sprite();


  (lib.title_01 = function() {
    this.spriteSheet = ss.effect_01_atlas_
    this.gotoAndStop(6)
  }).prototype = p = new cjs.Sprite()
  // helper functions:

  function mc_symbol_clone() {
    const clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop))
    clone.gotoAndStop(this.currentFrame)
    clone.paused = this.paused
    clone.framerate = this.framerate
    return clone
  }

  function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
    const prototype = cjs.extend(symbol, cjs.MovieClip)
    prototype.clone = mc_symbol_clone
    prototype.nominalBounds = nominalBounds
    prototype.frameBounds = frameBounds
    return prototype
  }


  (lib.title_01_1 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {})

    // 图层 1
    this.instance = new lib.title_01()
    this.instance.parent = this

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1))
  }).prototype = getMCSymbolPrototype(lib.title_01_1, new cjs.Rectangle(0, 0, 824, 208), null);


  (lib.luster_pic_01 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {})

    // 图层 1
    this.instance = new lib.luster_01()
    this.instance.parent = this

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1))
  }).prototype = p = new cjs.MovieClip()
  p.nominalBounds = new cjs.Rectangle(0, 0, 1295, 579);


  (lib.lust_pic_02 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {})

    // 图层 1
    this.instance = new lib.luster_02()
    this.instance.parent = this
    this.instance.setTransform(0, 0, 0.866, 0.899)

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1))
  }).prototype = p = new cjs.MovieClip()
  p.nominalBounds = new cjs.Rectangle(0, 0, 559.6, 579);


  (lib.des_01_1 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {})

    // 图层 1
    this.instance = new lib.des_01()
    this.instance.parent = this

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1))
  }).prototype = getMCSymbolPrototype(lib.des_01_1, new cjs.Rectangle(0, 0, 522, 100), null);


  (lib.元件3 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {})

    // 图层 1
    this.instance = new lib.des_04()
    this.instance.parent = this

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1))
  }).prototype = p = new cjs.MovieClip()
  p.nominalBounds = new cjs.Rectangle(0, 0, 135, 87);


  (lib.元件2 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {})

    // 图层 1
    this.instance = new lib.des_03()
    this.instance.parent = this

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1))
  }).prototype = p = new cjs.MovieClip()
  p.nominalBounds = new cjs.Rectangle(0, 0, 145, 84);


  (lib.元件1 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {})

    // 图层 1
    this.instance = new lib.des_02()
    this.instance.parent = this

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(1))
  }).prototype = p = new cjs.MovieClip()
  p.nominalBounds = new cjs.Rectangle(0, 0, 137, 74);


  (lib.luster_02_1 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {})

    // timeline functions:
    this.frame_24 = function() {
      this.stop()
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).wait(24).call(this.frame_24).wait(1))

    // 图层 9
    this.instance = new lib.元件2('synched', 0)
    this.instance.parent = this
    this.instance.setTransform(554.5, 535.5, 1, 1, 0, 0, 0, 72.5, 42)
    this.instance.alpha = 0
    this.instance._off = true

    this.timeline.addTween(cjs.Tween.get(this.instance).wait(19).to({ _off: false }, 0).to({ alpha: 1 }, 5)
      .wait(1))

    // 图层 10
    this.instance_1 = new lib.元件3('synched', 0)
    this.instance_1.parent = this
    this.instance_1.setTransform(280.5, 535.5, 1, 1, 0, 0, 0, 67.5, 43.5)
    this.instance_1.alpha = 0
    this.instance_1._off = true

    this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(14).to({ _off: false }, 0).to({ alpha: 1 }, 5)
      .wait(6))

    // 图层 8
    this.instance_2 = new lib.元件1('synched', 0)
    this.instance_2.parent = this
    this.instance_2.setTransform(6.6, 535.5, 1, 1, 0, 0, 0, 68.5, 37)
    this.instance_2.alpha = 0
    this.instance_2._off = true

    this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(9).to({ _off: false }, 0).to({ alpha: 1 }, 5)
      .wait(11))

    // 图层 1
    this.instance_3 = new lib.lust_pic_02('synched', 0)
    this.instance_3.parent = this
    this.instance_3.setTransform(279.8, 289.5, 1, 1, 0, 0, 0, 279.8, 289.5)
    this.instance_3.alpha = 0

    this.timeline.addTween(cjs.Tween.get(this.instance_3).to({ alpha: 1 }, 9).wait(16))
  }).prototype = p = new cjs.MovieClip()
  p.nominalBounds = new cjs.Rectangle(0, 0, 559.6, 579);


  (lib.luster_01_1 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {})

    // 图层 1
    this.instance = new lib.luster_pic_01('synched', 0)
    this.instance.parent = this
    this.instance.setTransform(647.5, 289.5, 1, 1, 0, 0, 0, 647.5, 289.5)
    this.instance.alpha = 0

    this.timeline.addTween(cjs.Tween.get(this.instance).to({ alpha: 1 }, 24).to({ alpha: 0 }, 25).wait(1))
  }).prototype = p = new cjs.MovieClip()
  p.nominalBounds = new cjs.Rectangle(0, 0, 1295, 579);


  // stage content:
  (lib.effect_01 = function(mode, startPosition, loop) {
    this.initialize(mode, startPosition, loop, {})

    // timeline functions:
    this.frame_90 = function() {
      /* 在此帧处停止
		时间轴将在插入此代码的帧处停止/暂停。
		也可用于停止/暂停影片剪辑的时间轴。
		*/

      this.stop()
    }

    // actions tween:
    this.timeline.addTween(cjs.Tween.get(this).wait(90).call(this.frame_90).wait(1))

    // title_01
    this.instance = new lib.title_01_1()
    this.instance.parent = this
    this.instance.setTransform(647.5, 201, 1, 1, 0, 0, 0, 412, 104)
    this.instance.alpha = 0

    this.timeline.addTween(cjs.Tween.get(this.instance).to({ alpha: 1 }, 19).wait(72))

    // des_01
    this.instance_1 = new lib.des_01_1()
    this.instance_1.parent = this
    this.instance_1.setTransform(647.5, 390, 1, 1, 0, 0, 0, 261, 50)
    this.instance_1.alpha = 0
    this.instance_1._off = true

    this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(19).to({ _off: false }, 0).to({ alpha: 1 }, 20)
      .wait(52))

    // luster_01
    this.instance_2 = new lib.luster_01_1()
    this.instance_2.parent = this
    this.instance_2.setTransform(647.5, 289.5, 1, 1, 0, 0, 0, 647.5, 289.5)
    this.instance_2._off = true

    this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(39).to({ _off: false }, 0).wait(52))

    // luster_02
    this.instance_3 = new lib.luster_02_1()
    this.instance_3.parent = this
    this.instance_3.setTransform(647.8, 289.5, 1, 1, 0, 0, 0, 279.8, 289.5)
    this.instance_3._off = true

    this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(49).to({ _off: false }, 0).wait(42))
  }).prototype = p = new cjs.MovieClip()
  p.nominalBounds = new cjs.Rectangle(883, 386.5, 824, 208)
  // library properties:
  lib.properties = {
    width: 1295,
    height: 579,
    fps: 24,
    color: '#FFFFFF',
    opacity: 0.00,
    manifest: [
      { src: 'images/effect_01_atlas_.png?1481188769626', id: 'effect_01_atlas_' },
    ],
    preloads: [],
  }
}(lib_01 = lib_01 || {}, images_01 = images_01 || {}, createjs = createjs || {}, ss_01 = ss_01 || {}, AdobeAn_01 = AdobeAn_01 || {}))
let lib_01, 
  images_01, 
  createjs, 
  ss_01, 
  AdobeAn_01
