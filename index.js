require('img-load')();

function Plugin() {
	/**
	 * Height which is used for comparing
	 * @type {number}
	 */
	this._extremeHeight = undefined;

	/**
	 * Window object
	 * @type {jQuery}
	 */
	this.$window = undefined;

	/**
	 * Elements to equalize
	 * @type {jQuery}
	 */
	this.$target = undefined;

	/**
	 * Main element
	 * @type {jQuery}
	 */
	this.$el = undefined;
}

Plugin.prototype = {
	constructor: Plugin,
	defaults: {
		target: '.js-equalize-target',
		breakpoint: {
			max: false,
			min: false
		},
		onImgLoad: false,
		byMaxHeight: true,
		callback: function() {}
	},

	init: function() {
		this._resolveOptions();
		this._setDataOptions();
		this._defineExtremeHeight();
		this._defineTarget();
		this.$window = $(window);
		this.$window.on('resize', this.run.bind(this));
		this.run();
	},

	run: function() {
		this.reset();
		if (!this._isAllowedWidth())
			return;
		this.onImgLoad(this.equalize.bind(this));
	},

	reset: function() {
		this.$target.css('height', '');
	},

	/**
	 * If to run the plugin for the current window width
	 * @return {Boolean}
	 */
	_isAllowedWidth: function() {
		var windowWidth = this.$window.width();
		if (this.options.breakpoint.min !== false && windowWidth <= this.options.breakpoint.min)
			return false;
		if (this.options.breakpoint.max !== false && windowWidth >= this.options.breakpoint.max)
			return false;
		return true;
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

	_defineExtremeHeight: function() {
		this._extremeHeight = this.options.byMaxHeight ? 0 : 100000;
	},

	_defineTarget: function() {
		this.$target = this.options.target instanceof $ ? 
			this.options.target : this.$el.find(this.options.target);
	},

	_getHeights: function() {
		return this.$target.map(function() {
			return $(this).outerHeight();
		}).get();
	},

	equalize: function() {
		var heights = this._getHeights();
		this.$target.height(this._defineHeight(heights));
		this.options.callback();
	},

	_defineHeight: function(heights) {
		heights.push(this._extremeHeight);
		return this.options.byMaxHeight ? Math.max.apply(null, heights) : Math.min.apply(null, heights);
	},

	_resolveOptions: function() {
		this.$el = this.options.$el;
	},

	_setDataOptions: function() {
		this.setOptions(this.$el.data(Plugin._name));
	},

	setOptions: function(options) {
		this.options = $.extend(true, {}, this.defaults, this.options, options);
		if (!this.options.$el)
			throw new Error('$el must be set in options');
	},

};

Plugin.options = {
	// Selector which will be used by plugin as default for target at init
	autoSelector: '.js-equalize-auto',
	pluginName: 'equalize'
};

Plugin._name = 'equalizer';

Plugin.init = function(options) {
	var inst = new this;
	inst.setOptions(options);
	inst.init();
	this.instance(inst);
};

Plugin.boot = function() {
	this.setJqueryProps();
	$(this.options.autoSelector).each(function() {
		$(this)[Plugin.options.pluginName]();
	});
	return this;
};

Plugin.setJqueryProps = function() {
	$.equalize = Plugin;
	$.fn[Plugin.options.pluginName] = Plugin.jqueryInit;
};

/**
 * JQuery plugin entry
 * @param  {Object} options 
 * @return {jQuery} jquery instance
 */
Plugin.jqueryInit = function(options) {
	var constructor = Plugin.jqueryConstructor.bind(Plugin, options);
	return this.each(constructor);
};

/**
 * JQuery constuctor
 * @param  {Object} options Options
 * @param  {number} index   Element index
 * @param  {HTMLElement} el Html element
 */
Plugin.jqueryConstructor = function(options, index, el) {
	Plugin.init(Plugin.resolveOptions($(el), options));
};

/**
 * Get/set instance to element
 * @param  {HTMLElement} el
 * @param  {Plugin} inst
 * @return {(Plugin|void)}
 */
Plugin.instance = function(inst) {
	var dataName = this._name + '_instance_' + inst.options.target;
	$.data(inst.$el[0], dataName, inst);
};

/**
 * Make options copy and set $el property
 * @param  {jQuery} $el     
 * @param  {Object} options Original options
 * @return {Object}         Resolved options
 */
Plugin.resolveOptions = function($el, options) {
	options = $.extend(true, {}, options);
	options.$el = $el;
	return options;
};


module.exports = Plugin;