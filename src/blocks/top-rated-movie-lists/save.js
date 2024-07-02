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

const MovieCard = ({ movie, attributes }) => {
	return (
		<div className="card">
			<div className="card__image">
				<img
					src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
					alt={movie.title}
				/>
			</div>
			<div class="card__header">
				<h2>{movie.title}</h2>
			</div>
			<div className="card__body">
				<p>{movie.overview}</p>
			</div>
			<div className="card__footer">
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
			</div>
		</div>
	);
};

export default function save({ attributes }) {
	const blockProps = useBlockProps.save();
	const fetchedMovies = attributes.fetchedMovies;

	return (
		<div {...blockProps}>
			<div
				className="movie-list"
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
