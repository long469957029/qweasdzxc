(function (lib, img, cjs, ss, an) {

var p; // shortcut to reference prototypes
lib.webFontTxtInst = {}; 
var loadedTypekitCount = 0;
var loadedGoogleCount = 0;
var gFontsUpdateCacheList = [];
var tFontsUpdateCacheList = [];
lib.ssMetadata = [
		{name:"effect_atlas_", frames: [[876,0,46,83],[355,154,375,135],[0,0,353,400],[355,0,519,152]]}
];



lib.updateListCache = function (cacheList) {		
	for(var i = 0; i < cacheList.length; i++) {		
		if(cacheList[i].cacheCanvas)		
			cacheList[i].updateCache();		
	}		
};		

lib.addElementsToCache = function (textInst, cacheList) {		
	var cur = textInst;		
	while(cur != exportRoot) {		
		if(cacheList.indexOf(cur) != -1)		
			break;		
		cur = cur.parent;		
	}		
	if(cur != exportRoot) {		
		var cur2 = textInst;		
		var index = cacheList.indexOf(cur);		
		while(cur2 != cur) {		
			cacheList.splice(index, 0, cur2);		
			cur2 = cur2.parent;		
			index++;		
		}		
	}		
	else {		
		cur = textInst;		
		while(cur != exportRoot) {		
			cacheList.push(cur);		
			cur = cur.parent;		
		}		
	}		
};		

lib.gfontAvailable = function(family, totalGoogleCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);		

	loadedGoogleCount++;		
	if(loadedGoogleCount == totalGoogleCount) {		
		lib.updateListCache(gFontsUpdateCacheList);		
	}		
};		

lib.tfontAvailable = function(family, totalTypekitCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);		

	loadedTypekitCount++;		
	if(loadedTypekitCount == totalTypekitCount) {		
		lib.updateListCache(tFontsUpdateCacheList);		
	}		
};
// symbols:



(lib.iphone = function() {
	this.spriteSheet = ss["effect_atlas_"];
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.lake = function() {
	this.spriteSheet = ss["effect_atlas_"];
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.pirateship = function() {
	this.spriteSheet = ss["effect_atlas_"];
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.title = function() {
	this.spriteSheet = ss["effect_atlas_"];
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.元件5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 图层 1
	this.instance = new lib.iphone();
	this.instance.parent = this;
	this.instance.setTransform(8,14,0.663,0.663);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(8,14,30.5,55);


(lib.元件4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 图层 1
	this.instance = new lib.title();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,519,152);


(lib.元件2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 图层 1
	this.instance = new lib.pirateship();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,353,400);


(lib.元件1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 图层 1
	this.instance = new lib.lake();
	this.instance.parent = this;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,375,135);


(lib.元件6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 图层 4
	this.instance = new lib.元件5("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(-27,112.5,1,1,45,0,0,23,41.5);
	this.instance.alpha = 0;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(27).to({_off:false},0).to({rotation:-675,x:-102,y:90.5,alpha:1},32,cjs.Ease.get(-1)).to({rotation:-1395,x:-175,y:240.4,alpha:0},60,cjs.Ease.get(1)).wait(1));

	// 图层 3
	this.instance_1 = new lib.元件5("synched",0);
	this.instance_1.parent = this;
	this.instance_1.setTransform(15.9,133.5,1,1,45,0,0,23,41.6);
	this.instance_1.alpha = 0;
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(14).to({_off:false},0).to({rotation:765,x:83.9,y:87.5,alpha:1},36,cjs.Ease.get(-1)).to({rotation:1485,x:139.9,y:212.4,alpha:0},59,cjs.Ease.get(1)).to({_off:true},1).wait(10));

	// 图层 2
	this.instance_2 = new lib.元件5("synched",0);
	this.instance_2.parent = this;
	this.instance_2.setTransform(-50,118.4,1,1,45,0,0,23,41.5);
	this.instance_2.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({rotation:-675,x:-118,y:87.4,alpha:1},40,cjs.Ease.get(-1)).to({rotation:-1395,x:-173,y:241.4,alpha:0},59,cjs.Ease.get(1)).to({_off:true},1).wait(20));

	// 图层 1
	this.instance_3 = new lib.元件5("synched",0);
	this.instance_3.parent = this;
	this.instance_3.setTransform(71,133.4,1,1,45,0,0,23,41.5);
	this.instance_3.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({rotation:765,x:155,y:79.5,alpha:1},29,cjs.Ease.get(-1)).to({rotation:1485,x:234,y:247.4,alpha:0},50,cjs.Ease.get(1)).to({_off:true},1).wait(40));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-80,88.4,181.4,75.5);


(lib.元件3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 图层 1
	this.instance = new lib.元件2("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(176.5,200,1,1,6.2,0,0,176.5,200);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({rotation:0},19,cjs.Ease.get(-0.5)).to({regY:200.1,rotation:-5,x:176.6,y:200.2},20,cjs.Ease.get(0.5)).to({regY:200,rotation:0,x:176.5,y:200},20,cjs.Ease.get(-0.5)).to({rotation:6.2},20,cjs.Ease.get(0.5)).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-20.6,-17.9,394.3,436);


// stage content:
(lib.effect = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 图层 3
	this.instance = new lib.元件4("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(274.5,76,1,1,0,0,0,259.5,76);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// iphone
	this.instance_1 = new lib.元件6();
	this.instance_1.parent = this;
	this.instance_1.setTransform(275,357.5,1,1,0,0,0,23,41.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	// 图层 1
	this.instance_2 = new lib.元件1("synched",0);
	this.instance_2.parent = this;
	this.instance_2.setTransform(269.5,552.4,1,1,0,0,0,187.5,67.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	// 图层 2
	this.instance_3 = new lib.元件3();
	this.instance_3.parent = this;
	this.instance_3.setTransform(269.5,336.9,1,1,0,0,0,176.5,200);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(290,325,519,619.9);
// library properties:
lib.properties = {
	width: 550,
	height: 650,
	fps: 24,
	color: "#FFFFFF",
	opacity: 0.00,
	webfonts: {},
	manifest: [
		{src:require("../images/effect_atlas_.png"), id:"effect_atlas_"}
	],
	preloads: []
};




})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{}, AdobeAn = AdobeAn||{});
var lib, images, ss, AdobeAn;

module.exports = {
	lib, images, ss, AdobeAn
};