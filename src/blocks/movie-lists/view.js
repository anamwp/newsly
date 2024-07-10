import React from 'react';

// const MovieCard = ({ movie }) => {
// 	console.log(movie);
// };
// console.log('movie', 'movie');

// export default MovieCard;

(function ($) {
	$(document).ready(function () {
		// <MovieCard movie={'movie'} />;
		// console.log(<MovieCard movie={'movie'} />);
		function getPageNumberFromUrl(url) {
			// Extract query parameters from the URL
			// var queryParams = getPageNumberFromUrl(anchor.href)
			var queryParams = url.split('&');
			// debugger;
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
				console.log('firing ajax');
				// debugger;
				var page = $(this).attr('href');
				const urlParams = new URL(page).searchParams;
				const blockId = urlParams.get('blockId');
				// debugger;

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
