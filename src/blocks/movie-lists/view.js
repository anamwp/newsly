(function ($) {
	$(document).ready(function () {
		function getPageNumberFromUrl(url) {
			// Extract query parameters from the URL
			// var queryParams = getPageNumberFromUrl(anchor.href)
			var queryParams = url.split('&');
			// Iterate through query parameters to find 'page' parameter
			for (var i = 0; i < queryParams.length; i++) {
				var param = queryParams[i].split('=');
				if (param[0] === 'page') {
					return param[1];
				}
			}
			// Return null if 'page' parameter is not found
			return null;
		}
		$(document).on(
			'click',
			'.movie-list-ajax-number-pagination a',
			function (e) {
				e.preventDefault();
				var page = $(this).attr('href');
				const urlParams = new URL(page).searchParams;
				const blockId = urlParams.get('blockId');

				var pageNumber = getPageNumberFromUrl(page);
				pageNumber = pageNumber ? pageNumber : 1;
				$.ajax({
					url: anamajaxpagination.ajaxurl,
					type: 'post',
					data: {
						action: 'popular_movie_pagination',
						pageNumber: pageNumber,
						blockId: blockId,
					},
					success: function (response) {
						console.log('response', response);
						$('.movie-list').empty().append(response);
						$(window).scrollTop(0);
					},
				});
			}
		);
	});
})(jQuery);
