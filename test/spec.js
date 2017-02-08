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
var PluginBooter = require('../index');
var Plugin = PluginBooter();
Plugin._name = 'plugin';

var $el;
var heights;
var sn;
beforeEach(function() {
	$el = $('<div>');
	heights = [];
	for (var i = 0; i < 10; i++) {
		var height = Math.floor((Math.random() * 900) + 1);
		heights.push(height);
		$el.append($('<div>', {
			height: height
		}));
	}
});
beforeEach(function() {
	sn = sinon.sandbox.create();
});
afterEach(function() {
	sn.restore();
});

describe('.jqueryConstructor', function() {
	it('if instance does not exist, call .init', function() {
		// sn.stub(Plugin, 'resolveOptions');
		// sn.stub(Plugin, 'init');
		// var instance = sn.stub(Plugin, 'instance').returns(undefined);
		// var el = $('<div>')[0];
		// Plugin.jqueryConstructor({}, 0, el);
		// expect(instance).to.have.been.called;
		
		// sn.stub(Plugin, 'resolveOptions');
		// sn.stub(Plugin, 'init');
		var init = sn.stub(Plugin, 'init');
		var el = $('<div>')[0];
		Plugin.jqueryConstructor({}, 0, el);
		expect(init).to.have.been.calledWith({
			$el: $(el)
		});
	});

	it('if instance exists, call #run', function() {
		sn.stub(Plugin, 'resolveOptions');
		sn.stub(Plugin, 'instance').returns(new Plugin);
		sn.stub(Plugin, 'init');
		var run = sn.stub(Plugin.prototype, 'run');
		var el = $('<div>')[0];
		Plugin.jqueryConstructor({}, 0, el);
		expect(run).to.have.been.called;
	});
});

describe('.instance', function() {
	it('if arguments is 2 length, bind instance to element', function() {
		var el = $('<div>')[0];
		var inst = new Plugin;
		Plugin.instance(el, inst);
		expect($.data(el, 'plugin_instance')).to.eql(inst);
	});

	it('if arguments is 1 length, get instance from element', function() {
		var el = $('<div>')[0];
		var inst = new Plugin;
		$.data(el, 'plugin_instance', inst);
		var expected = Plugin.instance(el);
		expect(expected).to.eql(inst);
	});
});

describe('.resolveOptions', function() {
	it('clone existing options', function() {
		
	});
});
