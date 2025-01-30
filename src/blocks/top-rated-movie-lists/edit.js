import React from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import SidebarControl from './sidebarControl';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import MovieCard from '../components/MovieCard';
import PopupModal from '../components/PopupModal';

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

export default function edit(props) {
	const blockProps = useBlockProps({
		className: 'top-rated-movie-lists-block',
	});
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
		attributes.fetchedMovies.length > 0 &&
			setMovies(attributes.fetchedMovies);

		attributes.fetchedMovies.length < 1 &&
			GetAPIResponseFromUrl(
				'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1'
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
	}, []);

	return (
		<div {...blockProps}>
			<SidebarControl props={props} />
			<PopupModal />
			<div
				id="top-rated-movie-lists"
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
