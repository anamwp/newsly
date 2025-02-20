import React from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import SidebarControl from './sidebarControl';
import { useState, useEffect } from '@wordpress/element';
import {
	__experimentalText as Text,
	__experimentalHeading as Heading,
} from '@wordpress/components';

/**
 * Handle API call to
 * Get popular movies from the API
 * @returns JSON
 */
const GetPopularMovies = async () => {
	// Todo: Get API keys from env file
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
/**
 * Handle API call to
 * Get movie genres from the API
 * @returns JSON
 */
const GetMovieGenres = async () => {
	// Todo: Get API keys from env file
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization:
				'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDQxMzQ5MmRiNWUyZTRjYTVlOTM0MDJjYTYyM2ZjYSIsIm5iZiI6MTcxOTIwNzU0OC45NzY5OCwic3ViIjoiNjY3OTA0YWNlZmRiOGMxNzc0MGI1MmZkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3LtMcOLpN8GfR8UiFDFPUYYHJVft69TrEzPssuTqnBA',
		},
	};
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
/**
 * Handle movie genre component
 * @param {Array} genreIDArr - genre id array
 * @param {Object} attributes - block attributes
 * @returns HTML
 */
const HandleGenreRender = ({ genreIDArr, attributes }) => {
	let getGenre = attributes.genres;
	let newGenreArr = getGenre.filter((ai) => genreIDArr.includes(ai.id));
	return (
		<ul>
			{newGenreArr.map((genre) => {
				return <li key={genre.id}>{genre.name}</li>;
			})}
		</ul>
	);
};
/**
 * MovieCard component
 * @param {Object} movie - movie object.
 * @param {Object} attributes - block attributes.
 * @returns HTML
 */
const MovieCard = ({ movie, attributes }) => {
	var headingPadding = attributes.titlePaddingAttr;
	return (
		<div className="movie-card">
			<div className="movie-card__image">
				<img
					src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
					alt={movie.title}
				/>
				<div className="meta">
					<div class="language-date">
						{attributes.showLanguage && (
							<span className="language">
								{movie.original_language}
							</span>
						)}
						{attributes.showReleaseDate && (
							<span className="date">{movie.release_date}</span>
						)}
					</div>
					<div class="vote">
						{attributes.showVoteAverage && (
							<span className="vote-average">
								{movie.vote_average}
							</span>
						)}
						{attributes.showVoteCount && (
							<span className="vote-count">
								{movie.vote_count}
							</span>
						)}
					</div>
				</div>
			</div>
			<div className="movie-card__content">
				<Heading
					style={{
						fontSize: `${attributes.titleFontSize}px`,
						fontWeight: attributes.titleFontWeight,
						letterSpacing: `${attributes.titleLetterSpacing}px`,
						lineHeight: `${attributes.titleLineHeight}`,
						fontStyle: attributes.titleStyle,
						textTransform: attributes.titleTransform,
						textDecoration: attributes.titleDecoration,
						padding: `${headingPadding?.top} ${headingPadding?.right} ${headingPadding?.bottom} ${headingPadding?.left}`,
					}}
					level={2}
				>
					{movie.title}
				</Heading>
				<div
					className="movie-card__overview overview"
					style={{
						padding: `${attributes.contentPaddingAttr.top} ${attributes.contentPaddingAttr.right} ${attributes.contentPaddingAttr.bottom} ${attributes.contentPaddingAttr.left}`,
					}}
				>
					<Text>{movie.overview}</Text>
				</div>
				<div
					className="movie-card__content__footer"
					style={{
						padding: `${attributes.contentPaddingAttr.top} ${attributes.contentPaddingAttr.right} ${attributes.contentPaddingAttr.bottom} ${attributes.contentPaddingAttr.left}`,
					}}
				>
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
		</div>
	);
};

export default function edit(props) {
	const blockProps = useBlockProps();
	const { attributes, setAttributes } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [movies, setMovies] = useState([]);
	/**
	 * Fetch movie and genre from the API
	 */
	useEffect(() => {
		/**
		 * Fetch genres from the API
		 * and set the attributes with the fetched genres
		 */
		attributes.genres.length < 1 &&
			GetMovieGenres()
				.then((res) => {
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
