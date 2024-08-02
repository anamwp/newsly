import React from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import GetFeaturedImage from './getFeaturedImage';
import SidebarControl from './sidebarControl';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

import RenderPostCategoryData from './components';
import {
	Disabled,
	Animate,
	Notice,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	CardMedia,
	__experimentalText as Text,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import axios from 'axios';

import { __ } from '@wordpress/i18n';

const GetPopularMovies = async () => {
	const movieAPIUrl = 'https://api.themoviedb.org/3/movie/popular';
	const apiKey = '94413492db5e2e4ca5e93402ca623fca';
	const apiResponse = await fetch(
		movieAPIUrl + `?api_key=${apiKey}&language=en-US&page=1`
	);
	const apiResponseJSON = await apiResponse.json();
	if (apiResponseJSON.success === false) {
		throw new Error(apiResponseJSON.status_message);
	}
	return apiResponseJSON;
};
const GetMovieGenres = async () => {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization:
				'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDQxMzQ5MmRiNWUyZTRjYTVlOTM0MDJjYTYyM2ZjYSIsIm5iZiI6MTcxOTIwNzU0OC45NzY5OCwic3ViIjoiNjY3OTA0YWNlZmRiOGMxNzc0MGI1MmZkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3LtMcOLpN8GfR8UiFDFPUYYHJVft69TrEzPssuTqnBA',
		},
	};
	// console.log('length', attributes.genres.length);
	const getGenreResponse = await fetch(
		'https://api.themoviedb.org/3/genre/movie/list?language=en',
		options
	);
	const getGenreResponseJSON = await getGenreResponse.json();
	if (getGenreResponseJSON.success === false) {
		throw new Error(getGenreResponseJSON.status_message);
	}
	return getGenreResponseJSON;
};

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

const MovieCard = ({ movie, attributes }) => {
	return (
		<Card>
			<CardMedia>
				<img
					src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
					alt={movie.title}
				/>
			</CardMedia>
			<CardHeader>
				<Heading level={2}>{movie.title}</Heading>
			</CardHeader>
			<CardBody>
				<Text>{movie.overview}</Text>
			</CardBody>
			<CardFooter>
				{attributes.showGenre && (
					<div className="genre">
						<HandleGenreRender
							genreIDArr={movie.genre_ids}
							attributes={attributes}
						/>
					</div>
				)}
				{attributes.showLanguage && (
					<p>Language - {movie.original_language}</p>
				)}
				{attributes.showReleaseDate && (
					<p>Release Date - {movie.release_date}</p>
				)}
				{attributes.showVoteCount && (
					<p>Vote Count - {movie.vote_count}</p>
				)}

				{attributes.showVoteAverage && (
					<p>Vote Average - {movie.vote_average}</p>
				)}
			</CardFooter>
		</Card>
	);
};

export default function edit(props) {
	const blockProps = useBlockProps();
	console.log('props before fetch', props);
	const { attributes, setAttributes } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [movies, setMovies] = useState([]);
	console.log('attributes', attributes);

	useEffect(() => {
		console.log('fetchedMovies', attributes.fetchedMovies.length);
		/**
		 * Fetch genres from the API
		 * and set the attributes with the fetched genres
		 */
		attributes.genres.length < 1 &&
			GetMovieGenres()
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
		attributes.fetchedMovies.length > 0 &&
			setMovies(attributes.fetchedMovies);

		attributes.fetchedMovies.length < 1 &&
			GetPopularMovies()
				.then((res) => {
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
	}, []);
	// console.log('movies', movies);

	return (
		<div {...blockProps}>
			<SidebarControl props={props} />
			<div
				className="movie-list"
				style={{
					gridTemplateColumns: `repeat(
						${attributes.movieColumn}, 1fr
					)`,
				}}
			>
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
