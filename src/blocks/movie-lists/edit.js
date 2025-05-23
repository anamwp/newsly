import React from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import SidebarControl from './sidebarControl';
import MovieCard from './components/MovieCard';
import { getPopularMovies, getMovieGenres } from './utils/api';


/**
 * Main edit component for the movie-lists block
 * @param {Object} props - Component props
 * @returns {JSX.Element} Block editor UI
 */
export default function Edit(props) {
	const blockProps = useBlockProps();
	const { attributes, setAttributes } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [movies, setMovies] = useState([]);

	/**
	 * Fetch movie and genre from the API
	 */
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				
				// Fetch genres if they haven't been fetched yet
				if (attributes.genres.length < 1) {
					try {
						const genresData = await getMovieGenres();
						setAttributes({ genres: genresData.genres });
					} catch (err) {
						console.error('Error fetching genres:', err);
						setError(__('Failed to load movie genres.'));
					}
				}
				
				// Use cached movies if available
				if (attributes.fetchedMovies.length > 0) {
					setMovies(attributes.fetchedMovies);
				} else {
					// Fetch new movies
					const moviesData = await getPopularMovies();
					setMovies(moviesData.results);
					setAttributes({ fetchedMovies: moviesData.results });
				}
			} catch (err) {
				console.error('Error fetching movies:', err);
				setError(__('Failed to load movies.'));
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Function to refresh movies
	const refreshMovies = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const moviesData = await getPopularMovies();
			setMovies(moviesData.results);
			setAttributes({ fetchedMovies: moviesData.results });
		} catch (err) {
			console.error('Error refreshing movies:', err);
			setError(__('Failed to refresh movies.'));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div {...blockProps}>
			<SidebarControl props={props} refreshMovies={refreshMovies} />
			
			{error && (
				<div className="movie-list-error">
					{error}
				</div>
			)}
			
			{isLoading ? (
				<div className="movie-list-loading">
					<Spinner />
					<p>{__('Loading movies...')}</p>
				</div>
			) : (
				<div
					className="movie-list"
					style={{
						gridTemplateColumns: `repeat(${attributes.movieColumn}, 1fr)`,
					}}
				>
					{movies && movies.length > 0 ? (
						movies.map((movie) => (
							<MovieCard
								key={movie.id}
								movie={movie}
								attributes={attributes}
							/>
						))
					) : !error && (
						<p>{__('No movies found.')}</p>
					)}
				</div>
			)}
		</div>
	);
}
