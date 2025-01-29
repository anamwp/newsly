import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';

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

const MovieCard = ({ movie, attributes }) => {
	// console.log('attributes', attributes);
	return (
		<div className="card" data-movieid={movie.id}>
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
						<span class="vote-count">{movie.vote_count}</span>
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
			<div class="card__header">
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

export default function save({ attributes }) {
	const blockProps = useBlockProps.save({
		className: 'gs-theatres-movie-block',
	});
	const fetchedMovies = attributes.fetchedMovies;

	return (
		<div {...blockProps}>
			<div id="popup-modal-for-movie-card" style={{ display: 'none' }}>
				<div id="close-modal">close</div>
				<div id="fetched-movie-content"></div>
			</div>
			<div
				id="theatres-movies-block"
				className="movie-list theatres-movies-block"
				style={{
					gridTemplateColumns: `repeat(
						${attributes.movieColumn}, 1fr
					)`,
				}}
			>
				{fetchedMovies &&
					fetchedMovies.map((movie) => (
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
