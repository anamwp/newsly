import React from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import SidebarControl from './sidebarControl';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

import { __ } from '@wordpress/i18n';
import MovieCard from '../components/MovieCard';
import PopupModal from '../components/PopupModal';
import APIResponsePromise from '../components/APIResponsePromise';

export default function edit(props) {
	const blockProps = useBlockProps({ className: 'gs-upcoming-movie-block' });
	const { attributes, setAttributes } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [movies, setMovies] = useState([]);

	const handleMovieUpdateForView = (newMovies) => {
		setMovies(newMovies);
		setAttributes({ fetchedMovies: newMovies });
		console.log('newMovies', newMovies);
	};

	useEffect(() => {
		/**
		 * Fetch genres from the API
		 * and set the attributes with the fetched genres
		 */
		attributes.genres.length < 1 &&
			APIResponsePromise(
				'https://api.themoviedb.org/3/genre/movie/list?language=en'
			)
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
			APIResponsePromise(
				'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1'
			)
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
			<SidebarControl
				props={props}
				handleMovieUpdateForView={handleMovieUpdateForView}
			/>
			<PopupModal />
			<div
				id="upcoming-movies-block"
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
