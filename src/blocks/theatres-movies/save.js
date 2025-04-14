import { __ } from '@wordpress/i18n';
import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import MovieCard from '../components/MovieCard';
import PopupModal from '../components/PopupModal';

export default function save({ attributes }) {
	const blockProps = useBlockProps.save({
		className: 'gs-theatres-movie-block',
	});
	const fetchedMovies = attributes.fetchedMovies;

	return (
		<div {...blockProps}>
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
