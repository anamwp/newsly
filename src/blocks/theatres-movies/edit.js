import React from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import SidebarControl from './sidebarControl';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import MovieCard from '../components/MovieCard';
import PopupModal from '../components/PopupModal';
import APIResponsePromise from '../components/APIResponsePromise';
import { use } from 'react';

export default function edit(props) {
	const blockProps = useBlockProps({ className: 'gs-theatres-movie-block' });
	// extract block name from props
	const blockName = props.name;
	if (!blockName) return null;
	// split the block name to get the block slug
	const blockSlug = blockName.split('/')[1];
	const restRouteForAddMeta =
		'/wp-json/anam-gutenberg-starter-block/v1/add-meta';
	// Get the current post ID
	const postId = useSelect((select) =>
		select('core/editor').getCurrentPostId()
	);
	const { attributes, setAttributes } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [movies, setMovies] = useState([]);
	const [metaInsertStatus, setMetaInsertStatus] = useState(() => {
		// Retrieve meta status from localStorage to prevent unnecessary API calls
		const savedStatus = localStorage.getItem(`meta_status_${postId}`);
		return savedStatus ? JSON.parse(savedStatus) : null;
	});
	/**
	 * Fetch meta status from the API
	 */
	useEffect(() => {
		if (!postId) return; // Ensure postId is available

		if (metaInsertStatus && 200 === metaInsertStatus.status) {
			return;
		}
		const metaInsertStatusPromise = fetch(
			`${restRouteForAddMeta}/${postId}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ blockSlug }),
			}
		);
		metaInsertStatusPromise
			.then((response) => {
				console.log(response);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				if (200 === data.status) {
					setMetaInsertStatus(data);
					localStorage.setItem(
						`meta_status_${postId}`,
						JSON.stringify(data)
					);
				}
			})
			.catch((error) => {
				console.error('Error adding meta:', error);
			});
	}, [postId]);

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
				'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'
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
				id="theatres-movies-block"
				className="movie-list theatres-movies-block"
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
