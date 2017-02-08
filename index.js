require('img-load')();

function Plugin() {
	
}

Plugin.prototype = {
	constructor: Plugin,
	defaults: {
		equalSelector: '.js-equalizer-col',
		minWidth: 0,
		maxWidth: 0,
		onImgLoad: false,
		byMaxHeight: true,
		callback: function() {}
	},

	init: function() {
		this._resolveOptions();
		this.$window = $(window);
		this.$window.on('resize', this.run.bind(this));
		this.run();
	},

	run: function() {
		var self = this;
		var windowWidth = this.$window.width();
		if (windowWidth <= this.options.minWidth && windowWidth >= this.options.maxWidth)
			return;
		this.onImgLoad(function() {
			self.equalize();
		});
	},

	onImgLoad: function(callback) {
		if (this.options.onImgLoad === false) {
			callback();
		} else {
			var imgSelector = $.type(this.options.onImgLoad) == 'string' ? this.options.onImgLoad : 'img';
			this.$el.imgLoad({
				callback: callback,
				imgSelector: imgSelector
			});
		}
	},

	_setExtremeHeight: function() {
		
	},

	_getHeights: function() {
		return this.$col.css('height', '').map(function() {
			return $(this).outerHeight();
		}).get();
	},

	equalize: function() {
		this._setExtremeHeight();
		var heights = this._getHeights();
		this.$col.outerHeight(this._defineHeight(heights));
		this.options.callback();
	},

	_defineHeight: function(heights) {
		heights.push(this.extremeHeight);
		return this.options.byMaxHeight ? Math.max.apply(null, heights) : Math.min.apply(null, heights);
	},

	_resolveOptions: function() {
		this.$el = this.options.$el;
		this.$col = this.options.col instanceof $ ? 
			this.options.col : this.$el.find(this.options.col);
		this.extremeHeight = this.options.byMaxHeight ? 0 : 100000;
	},

	setOptions: function(options) {
		this.options = $.extend(true, {}, this.defaults, options);
		if (!this.options.$el)
			throw new Error('$el must be set in options');
	},

};

Plugin.options = {
	autoSelector: '.js-equalize-auto',
	pluginName: 'equalize'
};

Plugin._name = 'equalizer';

Plugin.init = function(options) {
	var inst = new this;
	inst.setOptions(options);
	this.instance(options.$el[0], inst);
	inst.init();
};

Plugin.boot = function() {
	this.setJqueryProps();
	$(this.options.autoSelector).each(function() {
		var $this = $(this);
		var options = $this.data(Plugin._name);
		$this[Plugin.options.pluginName](options);
	});
	return this;
};

Plugin.setJqueryProps = function() {
	$.equalize = this;
	$.fn[Plugin.options.pluginName] = function(options) {
		var constructor = Plugin.jqueryConstructor.bind(Plugin, options);
		return this.each(constructor);
	};
};

Plugin.jqueryConstructor = function(options, index, el) {
	var inst = Plugin.instance(el);
	if (inst) inst.run();
	else
		Plugin.init(Plugin.resolveOptions($(el), options));
};

/**
 * Get/set instance to element
 * @param  {HTMLElement} el
 * @param  {Plugin} inst
 * @return {(Plugin|void)}
 */
Plugin.instance = function(el, inst) {
	var dataName = this._name + '_instance';
	if (inst)
		$.data(el, dataName, inst);
	else return $.data(el, dataName);
};

Plugin.resolveOptions = function($el, options) {
	options = $.extend(true, {}, options);
	options.$el = $el;
	return options;
};


module.exports = Plugin.boot.bind(Plugin);