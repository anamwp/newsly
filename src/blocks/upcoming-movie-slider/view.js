(function ($) {
	document.addEventListener('DOMContentLoaded', function () {
		const $slider = $('.upcoming-movie-list');
		/**
		 * get data attribute from upcoming-movie-list
		 */
		const slideColumn = $slider.attr('data-slide-column');
		console.log('attributes.movieColumn', slideColumn);
		if ($slider.length && !$slider.hasClass('slick-initialized')) {
			/**
			 * Initialize the slider
			 * with the following options
			 * Read more about the options here
			 * https://accessible360.github.io/accessible-slick/
			 */
			$slider.slick({
				arrows: true,
				dots: true,
				autoplay: true,
				slidesToShow: slideColumn,
				slidesToScroll: slideColumn,
				autoplaySpeed: 3000,
				responsive: [
					{
						breakpoint: 1300,
						settings: {
							arrows: false,
						},
					},
				],
			});
		}
	});
})(jQuery);
