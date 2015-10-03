function l(x) {
	console.log(x);
}
module.exports = function() {
	(function($, window, document, undefined) {
		var defaults = {
			equalSelector: '.js-col-equal',
			minWidth: 0,
			maxWidth: 0,
			onImgLoad: false,
			byMaxHeight: true,
			callback: function(){}
		};

		function Plugin(el, options) {
			var self = this;
			options = $.extend({}, defaults, options);
			this.init = function() {
				this.$el = $(el);
				this.$elEqual = this.$el.find(options.equalSelector);
				this.onImgLoad(function() {
					self.equalize();
				});
			};
			this.onImgLoad = function(callback) {
				if (options.onImgLoad === false) {
					callback();
				} else {
					var imgSelector = $.type(options.onImgLoad) == 'string' ? options.onImgLoad : 'img';
					self.$el.imgLoad({
						callback: callback,
						imgSelector: imgSelector
					});
				}
			};
			this._setExtremeHeight = function() {
				this._extremeHeight = options.byMaxHeight ? 0 : 100000;
			};
			this._getHeights = function() {
				return self.$elEqual.css('height', 'auto').map(function(index, el) {
					return $(this).height();
				});
			};
			this.equalize = function() {
				this._setExtremeHeight();
				var heights = this._getHeights();
				self.$elEqual.height(self._defineHeight(heights));
				options.callback();
			};
			this._defineHeight = function(heights) {
				heights.push(this._extremeHeight);
				return options.byMaxHeight ? Math.max.apply(null, heights) : Math.min.apply(null, heights);
			};
			this.init();
		}
		$.equalize = Plugin;
		$.fn.equalize = function(options) {
			return this.each(function(index, el) {
				new Plugin(this, options);
			});
		};
	})($, window, document);
};