global.l = function(x) {
	console.log(x);
};

var chai = require('chai'),
	assert = chai.assert,
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require('sinon-chai');

chai.use(sinonChai);

require('jsdom-global')();
global.$ = global.jQuery = require('jquery');
var Plugin = require('../index');
Plugin.boot();
Plugin._name = 'plugin';
var proto = Plugin.prototype;

var $el;
var $target;
var heights;
var sn;
beforeEach(function() {
	$el = $('<div>');
	heights = [];
	$target = $([]);
	for (var i = 0; i < 10; i++) {
		var height = Math.floor((Math.random() * 900) + 1);
		heights.push(height);
		var $targetSingle = $('<div>', {
			'class': 'js-equalize-target'
		}).outerHeight(height);
		$el.append($targetSingle);
		$target = $target.add($targetSingle);
	}
});
beforeEach(function() {
	sn = sinon.sandbox.create();
});
afterEach(function() {
	sn.restore();
});

describe('.instance', function() {
	describe('arguments length', function() {
		it('if 1, get instance', function() {
			var inst = new Plugin;
			$.data($el[0], 'plugin_instance', inst);
			expect(Plugin.instance($el[0])).to.eql(inst);
		});

		it('if 2, set instance', function() {
			var inst = new Plugin;
			Plugin.instance($el[0], inst)
			expect(Plugin.instance($el[0])).to.eql(inst);
		});
	});
});

describe('.resolveOptions', function() {
	it('has $el property', function() {
		var options = Plugin.resolveOptions($el, {});
		expect(options).to.eql({$el: $el});
	});

	it('clone original options', function() {
		var original = {prop: 'key'};
		var options = Plugin.resolveOptions($el, original);
		original.prop = 'key2';
		expect(options.prop).to.eql('key');
	});
});

describe('#defineHeight', function() {
	describe('case: options.byMaxHeight', function() {
		it('true: return max value', function() {
			var heights = [1, 2, 3];
			var context = {
				_extremeHeight: 1,
				options: {
					byMaxHeight: true
				}
			};
			var actual = proto._defineHeight.call(context, heights);
			expect(actual).to.eql(3);
		});

		it('false: return min value', function() {
			var heights = [1, 2, 3];
			var context = {
				_extremeHeight: 1,
				options: {
					byMaxHeight: false
				}
			};
			var actual = Plugin.prototype._defineHeight.call(context, heights);
			expect(actual).to.eql(1);
		});
	});

	it('include _extremeHeight property in calculations', function() {
		var heights = [1, 2, 3];
		var context = {
			_extremeHeight: 0,
			options: {
				byMaxHeight: false
			}
		};
		var actual = Plugin.prototype._defineHeight.call(context, heights);
		expect(actual).to.eql(0);
	});
});

describe('#_getHeights', function() {
	it('return columns heights', function() {
		var context = {
			$target: $target
		};
		var actual = proto._getHeights.call(context);
		expect(actual).to.eql(heights);
	});
});

describe('#_resolveOptions', function() {
	it('set $el property', function() {
		var context = {
			options: {
				$el: $el,
			}
		};
		proto._resolveOptions.call(context);
		expect(context.$el).to.eql($el);
	});
});

describe('#_defineTarget', function() {
	it('set $target property from option if options is jquery object', function() {
		var $target = $el.find('.js-equalize-col');
		var context = {
			options: {
				target: $target,
			}
		};
		proto._defineTarget.call(context);
		expect(context.$target).to.eql($target);
	});

	it('set $target property as jquery object from option if option is string', function() {
		var $target = $el.find('.js-equalize-col');
		var context = {
			$el: $el,
			options: {
				target: '.js-equalize-col'
			}
		};
		proto._defineTarget.call(context);
		expect(context.$target).to.eql($target);
	});
});

describe('#_isAllowedWidth', function() {
	it('if window width is smaller than max breakpoint and bigger than min, return true', function() {
		var context = {
			$window: {
				width: function() {
					return 500
				}
			},
			options: {
				breakpoint: {
					min: 400,
					max: 600
				}
			}
		};
		var actual = proto._isAllowedWidth.call(context);
		expect(actual).to.eql(true);
	});

	it('if min breakpoint is false, do not use it', function() {
		var context = {
			$window: {
				width: function() {
					return 500
				}
			},
			options: {
				breakpoint: {
					min: false,
					max: 600
				}
			}
		};
		var actual = proto._isAllowedWidth.call(context);
		expect(actual).to.eql(true);
	});

	it('if max breakpoint is false, do not use it', function() {
		var context = {
			$window: {
				width: function() {
					return 500
				}
			},
			options: {
				breakpoint: {
					min: 400,
					max: false
				}
			}
		};
		var actual = proto._isAllowedWidth.call(context);
		expect(actual).to.eql(true);
	});

	it('if one min breakpoint options does not fit, return false', function() {
		var context = {
			$window: {
				width: function() {
					return 500
				}
			},
			options: {
				breakpoint: {
					min: 550,
					max: 600
				}
			}
		};
		var actual = proto._isAllowedWidth.call(context);
		expect(actual).to.eql(false);
	});

	it('if max breakpoint options do not fit, return false', function() {
		var context = {
			$window: {
				width: function() {
					return 800
				}
			},
			options: {
				breakpoint: {
					min: 500,
					max: 600
				}
			}
		};
		var actual = proto._isAllowedWidth.call(context);
		expect(actual).to.eql(false);
	});

	it('if breakpoint options are false, return true', function() {
		var context = {
			$window: {
				width: function() {
					return 800
				}
			},
			options: {
				breakpoint: {
					min: false,
					max: false
				}
			}
		};
		var actual = proto._isAllowedWidth.call(context);
		expect(actual).to.eql(true);
	});
});

describe('#equalize', function() {
	it('set height from #_defineHeight', function() {
		var context = {
			options: {callback: function() {}},
			_getHeights: sn.stub(),
			_defineHeight: sn.stub().returns(300),
			$target: $target
		};
		proto.equalize.call(context);
		var isEqual = [].every.call($target, function(el) {
			return 300 == $(el).outerHeight();
		});
		expect(isEqual).to.eql(true);
	});
});