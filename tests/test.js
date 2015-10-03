function l(x) {
	console.log(x);
}
function makeFixture(options) {
	var defualts = {
		'class': 'js-col-equal',
		img: false
	};
	options = $.extend({}, defualts, options);
	
	var $el = $('<div />');
	var heights = [];
	for (var i = 0; i < 10; i++) {
		var height = Math.floor((Math.random() * 900) + 1);
		heights.push(height);
		$el.append($('<div />', {
			class: options.class,
			html: $('<div />').height(height).html($('<img />', {
				src: 'http://lorempixel.com/400/200/'
			}))
		}));
	}
	$el.appendTo('body');
	$el._heights = heights;
	return $el;
}
it('option #callback', function() {
	var $el = makeFixture();
	$el.equalize({
		callback: function() {
			assert(1);
		}
	});
});
it('option #byMaxHeight: true', function() {
	var $el = makeFixture();
	var heights = $el._heights;
	var maxHeight = Math.max.apply(null, heights);
	$el.equalize({
		byMaxHeight: true,
		callback: function() {
			var valid = true;
			$el.find('.js-col-equal').each(function(index, el) {
				valid = maxHeight === $(this).height();
			});
			assert(valid);
		}
	});
});
it('option #byMaxHeight: false', function() {
	var $el = makeFixture();
	var heights = $el._heights;
	var minHeight = Math.min.apply(null, heights);
	$el.equalize({
		byMaxHeight: false,
		callback: function() {
			$el.find('.js-col-equal').each(function(index, el) {
				assert(minHeight === $(this).height());
			});
		}
	});
});
it('option #equalSelector', function() {
	var $el = makeFixture({class: 'col'});
	var heights = $el._heights;
	var maxHeight = Math.max.apply(null, heights);
	$el.equalize({
		equalSelector: '.col',
		callback: function() {
			$el.find('.col').each(function(index, el) {
				assert(maxHeight === $(this).height());
			});
		}
	});
});
it('option #onImgLoad', function() {
	var $el = makeFixture();
	var heights = $el._heights;
	var maxHeight = Math.max.apply(null, heights);
	$el.equalize({
		onImgLoad: true,
		callback: function() {
			$el.find('.js-col-equal').each(function(index, el) {
				assert(maxHeight === $(this).height());
				assert($(this).find('img').height());
			});
		}
	});
});
