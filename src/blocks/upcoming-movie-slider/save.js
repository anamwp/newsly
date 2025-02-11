import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import styled from 'styled-components';

// const Wrapper = styled.div`
// 	background: red;
// `;

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

export default function save({ attributes }) {
	const blockProps = useBlockProps.save();
	const fetchedMovies = attributes.fetchedMovies;
	let sliceFirstTenMovies = [];
	if (fetchedMovies.length > 0) {
		sliceFirstTenMovies = fetchedMovies.slice(0, 10);
	}

	return (
		<div {...blockProps}>
			<div className="upcoming-movie-list">
				{sliceFirstTenMovies &&
					sliceFirstTenMovies.map((movie) => (
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
