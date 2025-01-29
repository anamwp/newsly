// import React from 'react';
// import { createRoot } from '@wordpress/element';
import HandleModal from '../components/HandleModal';

// var modlCardElement = document.querySelectorAll('#popup-modal-for-movie-card');
// var modalCloseElement = document.querySelectorAll('#close-modal');
// var fetchedMovieContent = document.getElementById('fetched-movie-content');

HandleModal(
	'#upcoming-movies-block.movie-list .card',
	'#popup-modal-for-movie-card'
);

// /**
//  * Hide the modal
//  */
// modlCardElement[0].style.display = 'none';
// /**
//  * Close the modal
//  */
// modalCloseElement[0].addEventListener('click', function () {
// 	modlCardElement[0].style.display = 'none';
// 	fetchedMovieContent.innerHTML = '';
// });

// /**
//  * Fetch data from the API
//  * @param {string} url url to fetch data from
//  * @returns Promise
//  */
// const GetAPIResponseFromUrl = async (url = '') => {
// 	const options = {
// 		method: 'GET',
// 		headers: {
// 			accept: 'application/json',
// 			Authorization:
// 				'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDQxMzQ5MmRiNWUyZTRjYTVlOTM0MDJjYTYyM2ZjYSIsIm5iZiI6MTcxOTIwNzU0OC45NzY5OCwic3ViIjoiNjY3OTA0YWNlZmRiOGMxNzc0MGI1MmZkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3LtMcOLpN8GfR8UiFDFPUYYHJVft69TrEzPssuTqnBA',
// 		},
// 	};
// 	const getMovieAPIResponse = await fetch(url, options);
// 	console.log('getMovieAPIResponse', getMovieAPIResponse);
// 	const getMovieAPIResponseJSON = await getMovieAPIResponse.json();
// 	if (getMovieAPIResponseJSON.success === false) {
// 		throw new Error(getMovieAPIResponseJSON.status_message);
// 	}
// 	return getMovieAPIResponseJSON;
// };

// const LoadingState = () => {
// 	const style = {
// 		width: '100%',
// 		height: '100%',
// 	};
// 	return (
// 		<div class="flex flex-row align-top h-full p-10 gap-5 overflow-hidden">
// 			<div className="left w-1/2 h-full">
// 				<span
// 					class="bg-slate-300 flex items-center justify-center text-2xl"
// 					style={style}
// 				>
// 					Image is loading.
// 				</span>
// 			</div>
// 			<div className="right w-1/2 overflow-scroll items-center justify-center flex text-2xl">
// 				Data is loading. Please wait...
// 			</div>
// 		</div>
// 	);
// };

// const HandleMovieContentRender = (props) => {
// 	return (
// 		<div class="flex flex-row align-top h-full p-10 gap-5 overflow-hidden">
// 			<div className="left w-1/2 h-full">
// 				<img
// 					class="w-full object-cover h-full"
// 					src={`https://image.tmdb.org/t/p/w500${props.data.poster_path}`}
// 					alt={props.data.title}
// 				/>
// 			</div>
// 			<div className="right w-1/2 overflow-scroll">
// 				<h1 class="text-2xl font-bold font-poppins font-medium">
// 					{props.data.title}
// 				</h1>
// 				<div className="overview mb-3">{props.data.overview}</div>
// 				<div>
// 					<span class="font-bold font-poppins capitalize">
// 						genres -{' '}
// 					</span>
// 					{props.data.genres.map((genre) => genre.name).join(', ')}
// 				</div>
// 				<div>
// 					<span class="font-bold font-poppins capitalize">
// 						Production Companies -{' '}
// 					</span>
// 					{props.data.production_companies
// 						.map((company) => company.name)
// 						.join(', ')}
// 				</div>
// 				<div>
// 					<span class="font-bold font-poppins capitalize">
// 						Spoken Language -{' '}
// 					</span>
// 					{props.data.spoken_languages
// 						.map((language) => language.name)
// 						.join(', ')}
// 				</div>
// 				<ul>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							ID
// 						</span>{' '}
// 						- {props.data.id}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							Release Data
// 						</span>{' '}
// 						- {props.data.release_date}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							Status
// 						</span>{' '}
// 						- {props.data.status}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							tagline
// 						</span>{' '}
// 						- {props.data.tagline}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							Original language
// 						</span>{' '}
// 						- {props.data.original_language}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							IMDb ID
// 						</span>{' '}
// 						- {props.data.imdb_id}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							video
// 						</span>{' '}
// 						- {props.data.video}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							vote_average
// 						</span>{' '}
// 						- {props.data.vote_average}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							vote_count
// 						</span>{' '}
// 						- {props.data.vote_count}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							runtime
// 						</span>{' '}
// 						- {props.data.runtime}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							revenue
// 						</span>{' '}
// 						- {props.data.revenue}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							homepage
// 						</span>{' '}
// 						- {props.data.homepage}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							budget
// 						</span>{' '}
// 						- {props.data.budget}
// 					</li>
// 				</ul>
// 			</div>
// 		</div>
// 	);
// };
// /**
//  * Handle click on movie card
//  */
// const MovieCardNode = document.querySelectorAll(
// 	'#theatres-movies-block.movie-list .card'
// );
// MovieCardNode.forEach((node) => {
// 	node.addEventListener('click', (e) => {
// 		e.preventDefault();
// 		var movieId = node.getAttribute('data-movieid');
// 		handleMovieModelOpen(movieId);
// 		// console.log('movieId', movieId);
// 	});
// });

// /**
//  * Handle fetch data regarding single movie
//  * @param {string} movieID ID of the single movie
//  */
// function handleMovieModelOpen(movieID) {
// 	document
// 		.querySelector('#popup-modal-for-movie-card')
// 		.setAttribute('style', 'display: flex;');
// 	// .css('display', 'flex');
// 	let movieId = movieID;
// 	var loading = true;
// 	if (loading) {
// 		createRoot(fetchedMovieContent).render(<LoadingState />);
// 	}
// 	GetAPIResponseFromUrl(
// 		`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
// 	)
// 		.then((res) => {
// 			loading = false;
// 			createRoot(fetchedMovieContent).render(
// 				<HandleMovieContentRender data={res} />
// 			);
// 		})
// 		.catch((err) => console.log('genre err', err));
// }
