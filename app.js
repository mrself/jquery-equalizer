(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('img-load')();
require('./build.js')();
},{"./build.js":2,"img-load":3}],2:[function(require,module,exports){
function l(t){console.log(t)}module.exports=function(){!function(t,e,i,n){function h(e,i){var n=this;i=t.extend({},o,i),this.init=function(){this.$el=t(e),this.$elEqual=this.$el.find(i.equalSelector),this.onImgLoad(function(){n.equalize()})},this.onImgLoad=function(e){if(i.onImgLoad===!1)e();else{var h="string"==t.type(i.onImgLoad)?i.onImgLoad:"img";n.$el.imgLoad({callback:e,imgSelector:h})}},this._setExtremeHeight=function(){this._extremeHeight=i.byMaxHeight?0:1e5},this._getHeights=function(){return n.$elEqual.css("height","auto").map(function(e,i){return t(this).height()})},this.equalize=function(){this._setExtremeHeight();var t=this._getHeights();n.$elEqual.height(n._defineHeight(t)),i.callback()},this._defineHeight=function(t){return t.push(this._extremeHeight),i.byMaxHeight?Math.max.apply(null,t):Math.min.apply(null,t)},this.init()}var o={equalSelector:".js-col-equal",minWidth:0,maxWidth:0,onImgLoad:!1,byMaxHeight:!0,callback:function(){}};t.equalize=h,t.fn.equalize=function(t){return this.each(function(e,i){new h(this,t)})}}($,window,document)};
},{}],3:[function(require,module,exports){
module.exports = function() {
	(function($) {
		var defaults = {
			callback: function(){},
			imgSelector: 'img'
		};

		$.fn.imgLoad = function(options) {
			options = $.extend({}, defaults, options);
			
			return this.each(function(index, el) {
				var $el = $(this),
					countLoadedImgs = 0,
					$img = $el.find(options.imgSelector),
					countImg = $img.length;

				$img.each(function(index, el) {
					if (this.complete) checkLoaded();
					else this.onload = checkLoaded;
				});
				function checkLoaded() {
					if (countImg == ++countLoadedImgs) options.callback($img);
				}
			});
		};
	})(jQuery);
};
},{}]},{},[1]);
