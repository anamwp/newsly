import React, { useState } from 'react';
import { Button } from '@wordpress/components';
import FetchMovie from './FetchMovie';
/**
 * HandleMovieUpdate component
 * @param {Object} attributes - The attributes of the block
 * @param {Function} setAttributes - The setAttributes function of the block
 * @param {String} movieAttributeKey - The key of the movie attribute in the block
 * @param {String} movieAPIUrl - The URL of the movie API
 * @param {Function} fnHandleMovieUpdateForView - The function to update the parent component with the new movie data
 * @returns {Component} - The HandleMovieUpdate component
 */
export default function HandleMovieUpdate({
	attributes,
	setAttributes,
	movieAttributeKey,
	movieAPIUrl,
	fnHandleMovieUpdateForView,
}) {
	const [checkUpdateLoader, setCheckUpdateLoader] = useState(false);
	const [updateAttrLoader, setUpdateAttrLoader] = useState(false);
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [newUpdatedMovie, setNewUpdatedMovie] = useState([]);
	const [checkUpdateMessage, setCheckUpdateMessage] = useState('');

	var oldTheatreMovies = attributes.fetchedMovies;
	var oldTheatreMoviesID = [];
	oldTheatreMovies.forEach((element) => {
		oldTheatreMoviesID.push(element.id);
	});

	const handleCheckForMovieUpdate = (
		attributes,
		setAttributes,
		remoteUrl
	) => {
		setCheckUpdateLoader(true);
		let oldTheatreMovies = attributes.fetchedMovies;
		var newTheatreMovies = [];
		var newTheatreMoviesID = [];
		var isChanged;
		let url = remoteUrl;
		let updatedDataPromise = FetchMovie(url);
		updatedDataPromise
			.then((res) => {
				newTheatreMovies = res.results;
				/**
				 * Loop through the new movies and
				 * get the IDs of the new movies
				 * by comparing with the old movies
				 * IDs and store them in an array newTheatreMoviesID
				 */
				newTheatreMovies.forEach((element) => {
					if (!oldTheatreMoviesID.includes(element.id)) {
						newTheatreMoviesID.push(element.id);
					}
				});
				/**
				 * Check if the data is changed
				 */
				isChanged =
					JSON.stringify(newTheatreMovies) !==
					JSON.stringify(oldTheatreMovies);
				if (isChanged || newTheatreMoviesID.length > 0) {
					setUpdateAvailable(true);
					setCheckUpdateMessage('New movies available');
				} else {
					setUpdateAvailable(false);
					setCheckUpdateMessage('No new movies available');
				}
				setCheckUpdateLoader(false);
				setNewUpdatedMovie(newTheatreMovies);
			})
			.catch((e) => console.log(e));
	};
	/**
	 * Fire the update function
	 */
	const handleMovieUpdate = () => {
		setUpdateAttrLoader(true);
		/**
		 * Update the movie data in the block attribute
		 */
		setAttributes({ [movieAttributeKey]: newUpdatedMovie });
		/**
		 * Update parent component with the new movie data
		 */
		fnHandleMovieUpdateForView(newUpdatedMovie);
		setTimeout(() => {
			setUpdateAttrLoader(false);
			// update message
			setCheckUpdateMessage('Movies updated successfully');
			// disable update button
			setUpdateAvailable(false);
		}, 5000);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '10px',
			}}
		>
			<Button
				onClick={() =>
					handleCheckForMovieUpdate(
						attributes,
						setAttributes,
						movieAPIUrl
					)
				}
				variant="primary"
			>
				{checkUpdateLoader ? 'Loading' : 'Check for Update'}
			</Button>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '10px',
				}}
			>
				<span
					style={{
						color: updateAvailable ? 'green' : 'black',
					}}
				>
					{checkUpdateMessage}
				</span>
				{updateAvailable && (
					<Button
						variant="secondary"
						onClick={() => {
							handleMovieUpdate();
						}}
					>
						{updateAttrLoader ? 'Updating' : 'Update'}
					</Button>
				)}
			</div>
		</div>
	);
}
