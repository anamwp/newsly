import React from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import SidebarControl from './sidebarControl';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import styled from 'styled-components';

// const Wrapper = styled.div`
// 	background: red;
// `;

/**
 * Function to fetch API response from URL
 * @param {url} url API URL
 * @returns
 */
const GetAPIResponseFromUrl = async (url = '') => {
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
/**
 * Handle Genre Render
 * @param {*} param0
 * @returns
 */
const HandleGenreRender = ({ genreIDArr, attributes }) => {
	// console.log('IDs', genreIDArr);
	let getGenre = attributes.genres;
	// let isFound = getGenre.some((ai) => genreIDArr.includes(ai));
	let newGenreArr = getGenre.filter((ai) => genreIDArr.includes(ai.id));
	return (
		<ul>
			{newGenreArr.map((genre) => {
				return <li key={genre.id}>{genre.name}</li>;
			})}
		</ul>
	);
	// return newGenreArr;
	// console.log('getGenre', newGenreArr);
	// console.log('is found', isFound);
};
const HandleRoundNumber = (number, decimal_digit) => {
	let powerOften = Math.pow(10, decimal_digit);
	let result = Math.round(number * powerOften) / powerOften;
	return result;
};
const HandleDate = (date) => {
	let dateParseString = Date.parse(date);
	let newDate = new Date(dateParseString);
	let getYear = newDate.getFullYear();
	return getYear;
};
/**
 * Movie Card Component
 * @param {*} param0
 * @returns
 */
const MovieCard = ({ movie, attributes }) => {
	return (
		<div className="card">
			<div className="card__image">
				<img
					src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
					alt={movie.title}
				/>
				<div className="rating-point">
					{attributes.showVoteAverage && (
						<span className="vote-point">
							{HandleRoundNumber(movie.vote_average, 1)}
						</span>
					)}
					{attributes.showVoteCount && (
						<span className="vote-count">{movie.vote_count}</span>
					)}
				</div>
				<div className="language-and-yeaer">
					{attributes.showLanguage && (
						<span className="language">
							{movie.original_language}
						</span>
					)}
					{attributes.showReleaseDate && (
						<span className="year">
							{HandleDate(movie.release_date)}
						</span>
					)}
				</div>
			</div>
			<div className="card__header">
				<h2>{movie.title}</h2>
			</div>
			{attributes.showDescription && (
				<div className="card__body">
					<p>{movie.overview}</p>
				</div>
			)}
			<div className="card__footer">
				{attributes.showGenre && (
					<div className="genre">
						<HandleGenreRender
							genreIDArr={movie.genre_ids}
							attributes={attributes}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default function edit(props) {
	const blockProps = useBlockProps();
	const { attributes, setAttributes } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [movies, setMovies] = useState([]);

	useEffect(() => {
		/**
		 * Fetch genres from the API
		 * and set the attributes with the fetched genres
		 */
		attributes.genres.length < 1 &&
			GetAPIResponseFromUrl(
				'https://api.themoviedb.org/3/genre/movie/list?language=en'
			)
				.then((res) => {
					console.log('res', res);
					setAttributes({ genres: res.genres });
				})
				.catch((err) => console.log('genre err', err));
		/**
		 * Fetch movies from the API
		 * and set the state
		 * with the fetched movies
		 */
		if (attributes.fetchedMovies.length > 0) {
			const sliceFirstTenMovies = attributes.fetchedMovies.slice(0, 10);
			setMovies(sliceFirstTenMovies);
		}

		attributes.fetchedMovies.length < 1 &&
			GetAPIResponseFromUrl(
				'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1'
			)
				.then((res) => {
					console.log('res', res);
					/**
					 * Set state with the fetched movies
					 */
					setMovies(res.results);
					/**
					 * Set attributes with the fetched movies
					 */
					setAttributes({ fetchedMovies: res.results });
				})
				.catch((err) => console.log('err', err));

		console.log('hello useeffect');
		console.log('hello useeffect', movies);
		(function ($) {
			$(document).ready(function ($) {
				console.log(document.querySelector('.upcoming-movie-list'));
				$('.upcoming-movie-list').slick({
					arrows: true,
					dots: true,
					autoplay: true,
					slidesToShow: 3,
					slidesToScroll: 3,
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
			});
		})(jQuery);
	}, []);

	return (
		<div {...blockProps}>
			<SidebarControl props={props} />
			<div className="upcoming-movie-list">
				{movies &&
					movies.map((movie) => (
						<MovieCard
							key={movie.id}
							movie={movie}
							attributes={attributes}
						/>
					))}
			</div>
		</div>
	);
}
