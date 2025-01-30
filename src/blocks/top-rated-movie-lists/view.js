// import React from 'react';
// import { createRoot } from '@wordpress/element';

import HandleModal from '../components/HandleModal';
HandleModal(
	'#top-rated-movie-lists.movie-list .card',
	'#popup-modal-for-movie-card'
);

// /**
//  * Select elements
//  */
// let cardElement = document.querySelectorAll('.card');
// var modlCardElement = document.querySelectorAll('#popup-modal-for-movie-card');
// var modalCloseElement = document.querySelectorAll('#close-modal');
// var fetchedMovieContent = document.getElementById('fetched-movie-content');
// console.log('fetchedMovieContent', fetchedMovieContent);
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
// 	const getMovieAPIResponseJSON = await getMovieAPIResponse.json();
// 	if (getMovieAPIResponseJSON.success === false) {
// 		throw new Error(getMovieAPIResponseJSON.status_message);
// 	}
// 	return getMovieAPIResponseJSON;
// };
// const LoadingState = () => {
// 	console.log('hello');
// 	return <div>Loading...</div>;
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
//  * Open the modal
//  */
// cardElement.forEach((element) => {
// 	element.addEventListener('click', function () {
// 		modlCardElement[0].style.display = 'flex';
// 		let movieId = this.getAttribute('data-movieId');
// 		GetAPIResponseFromUrl(
// 			`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
// 		)
// 			.then((res) => {
// 				console.log('res from api', res);
// 				// setAttributes({ genres: res.genres });
// 				// fetchedMovieContent.append(res);
// 				// var NewContent = ;
// 				// NewContent.then((res) => {
// 				// 	console.log('resss', res);
// 				// });
// 				// console.log(JSON.stringify(NewContent));
// 				createRoot(fetchedMovieContent).render(
// 					<HandleMovieContentRender data={res} />
// 				);

// 				// fetchedMovieContent.render(<h1>Hello world</h1>);
// 			})
// 			.catch((err) => console.log('genre err', err));
// 	});
// });
