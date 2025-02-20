import React, { Suspense, useState } from 'react';
import { createRoot } from '@wordpress/element';
/**
 * Select elements
 */
let cardElement = document.querySelectorAll('.movie-card');
var modlCardElement = document.querySelectorAll('#popup-modal-for-movie-card');
var modalCloseElement = document.querySelectorAll('#close-modal');
var fetchedMovieContent = document.getElementById('fetched-movie-content');

/**
 * Hide the modal
 */
if (modlCardElement) {
	modlCardElement[0].style.display = 'none';
	/**
	 * Close the modal
	 */
	modalCloseElement[0].addEventListener('click', function () {
		modlCardElement[0].style.display = 'none';
		fetchedMovieContent.innerHTML = '';
	});
}
/**
 * Fetch data from the API
 * @param {string} url - url to fetch data from.
 * @returns Promise
 */
const GetAPIResponseFromUrl = async (url = '') => {
	// Todo: Get API keys from env file
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization:
				'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDQxMzQ5MmRiNWUyZTRjYTVlOTM0MDJjYTYyM2ZjYSIsIm5iZiI6MTcxOTIwNzU0OC45NzY5OCwic3ViIjoiNjY3OTA0YWNlZmRiOGMxNzc0MGI1MmZkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3LtMcOLpN8GfR8UiFDFPUYYHJVft69TrEzPssuTqnBA',
		},
	};
	const getMovieAPIResponse = await fetch(url, options);
	const getMovieAPIResponseJSON = await getMovieAPIResponse.json();
	if (getMovieAPIResponseJSON.success === false) {
		throw new Error(getMovieAPIResponseJSON.status_message);
	}
	return getMovieAPIResponseJSON;
};

const LoadingState = () => {
	const style = {
		width: '100%',
		height: '100%',
	};
	return (
		<div className="flex flex-row align-top h-full p-10 gap-5 overflow-hidden">
			<div className="left w-1/2 h-full">
				<span
					className="bg-slate-300 flex items-center justify-center text-2xl"
					style={style}
				>
					Image is loading.
				</span>
			</div>
			<div className="right w-1/2 overflow-scroll items-center justify-center flex text-2xl">
				Data is loading. Please wait...
			</div>
		</div>
	);
};

const HandleMovieContentRender = (props) => {
	return (
		<div className="flex flex-row align-top h-full p-10 gap-5 overflow-hidden">
			<div className="left w-1/2 h-full">
				<img
					className="w-full object-cover h-full"
					src={`https://image.tmdb.org/t/p/w500${props.data.poster_path}`}
					alt={props.data.title}
				/>
			</div>
			<div className="right w-1/2 overflow-scroll">
				<h1 className="text-2xl font-bold font-poppins font-medium">
					{props.data.title}
				</h1>
				<div className="overview mb-3">{props.data.overview}</div>
				<div>
					<span className="font-bold font-poppins capitalize">
						genres -{' '}
					</span>
					{props.data.genres.map((genre) => genre.name).join(', ')}
				</div>
				<div>
					<span className="font-bold font-poppins capitalize">
						Production Companies -{' '}
					</span>
					{props.data.production_companies
						.map((company) => company.name)
						.join(', ')}
				</div>
				<div>
					<span className="font-bold font-poppins capitalize">
						Spoken Language -{' '}
					</span>
					{props.data.spoken_languages
						.map((language) => language.name)
						.join(', ')}
				</div>
				<ul>
					<li>
						<span className="font-bold font-poppins capitalize">
							ID
						</span>{' '}
						- {props.data.id}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							Release Data
						</span>{' '}
						- {props.data.release_date}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							Status
						</span>{' '}
						- {props.data.status}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							tagline
						</span>{' '}
						- {props.data.tagline}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							Original language
						</span>{' '}
						- {props.data.original_language}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							IMDb ID
						</span>{' '}
						- {props.data.imdb_id}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							video
						</span>{' '}
						- {props.data.video}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							vote_average
						</span>{' '}
						- {props.data.vote_average}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							vote_count
						</span>{' '}
						- {props.data.vote_count}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							runtime
						</span>{' '}
						- {props.data.runtime}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							revenue
						</span>{' '}
						- {props.data.revenue}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							homepage
						</span>{' '}
						- {props.data.homepage}
					</li>
					<li>
						<span className="font-bold font-poppins capitalize">
							budget
						</span>{' '}
						- {props.data.budget}
					</li>
				</ul>
			</div>
		</div>
	);
};

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
						$('.movie-list').empty().append(response);
						$(window).scrollTop(0);
					},
				});
			}
		);
	});
	/**
	 * Handle click on movie card
	 */
	$(document).on(
		'click',
		'.new-movie-list-block .movie-list .movie-card',
		function (e) {
			e.preventDefault();
			var movieId = this.getAttribute('data-movieid');
			handleMovieModelOpen(movieId);
		}
	);
	/**
	 * Handle fetch data regarding single movie
	 * @param {string} movieID ID of the single movie
	 */
	function handleMovieModelOpen(movieID) {
		$('#popup-modal-for-movie-card').css('display', 'flex');
		let movieId = movieID;
		var loading = true;
		if (loading) {
			createRoot(fetchedMovieContent).render(<LoadingState />);
		}
		GetAPIResponseFromUrl(
			`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
		)
			.then((res) => {
				loading = false;
				createRoot(fetchedMovieContent).render(
					<HandleMovieContentRender data={res} />
				);
			})
			.catch((err) => console.log('genre err', err));
	}
})(jQuery);
