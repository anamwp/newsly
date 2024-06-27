import React from 'react';
import { useSelect, withSelect, select } from '@wordpress/data';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import GetFeaturedImage from './getFeaturedImage';
import SidebarControl from './sidebarControl';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

import RenderPostCategoryData from './components';
import {
	Disabled,
	Animate,
	Notice,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	CardMedia,
	__experimentalText as Text,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import axios from 'axios';

import { __ } from '@wordpress/i18n';

const MyAnimatedNotice = () => (
	<Animate type="slide-in" options={{ origin: 'top' }}>
		{({ className }) => (
			<Notice className={className} status="success">
				<p>Animation finished.</p>
			</Notice>
		)}
	</Animate>
);

const MovieCard = ({ movie }) => {
	return (
		// <div className="movie-card">
		// 	<img
		// 		src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
		// 		alt={movie.title}
		// 	/>
		// 	<h3>{movie.title}</h3>
		// 	<p className="overview">{movie.overview}</p>
		// </div>
		<Card>
			<CardMedia>
				<img
					src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
					alt={movie.title}
				/>
			</CardMedia>
			<CardHeader>
				<Heading level={2}>{movie.title}</Heading>
			</CardHeader>
			<CardBody>
				<Text>{movie.overview}</Text>
			</CardBody>
			{/* <CardFooter></CardFooter> */}
		</Card>
	);
};

const getTopRatedMovies = async () => {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization:
				'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDQxMzQ5MmRiNWUyZTRjYTVlOTM0MDJjYTYyM2ZjYSIsIm5iZiI6MTcxOTIwNzU0OC45NzY5OCwic3ViIjoiNjY3OTA0YWNlZmRiOGMxNzc0MGI1MmZkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3LtMcOLpN8GfR8UiFDFPUYYHJVft69TrEzPssuTqnBA',
		},
	};
	const topRatedResponse = await fetch(
		'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
		options
	);
	const topRatedResponseJSON = await topRatedResponse.json();
	if (topRatedResponseJSON.success === false) {
		throw new Error(topRatedResponseJSON.status_message);
	}
	return topRatedResponseJSON;
};

const getPopularMovies = async () => {
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

// card
const CardComponent = () => {
	return (
		<Card>
			<CardHeader>
				<Heading level={4}>Card Title</Heading>
			</CardHeader>
			<CardBody>
				<Text>Card Content</Text>
			</CardBody>
			<CardFooter>
				<Text>Card Footer</Text>
			</CardFooter>
		</Card>
	);
};

export default function edit(props) {
	const blockProps = useBlockProps();
	console.log('props before fetch', props);
	const { attributes, setAttributes } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [movies, setMovies] = useState([]);

	useEffect(() => {
		getPopularMovies()
			.then((res) => console.log('top rated movie res 2', res))
			.catch((err) => console.log('top rated movie err 2', err));
		getTopRatedMovies()
			.then((res) => console.log('top rated movie res 1', res))
			.catch((err) => console.log('top rated movie err 1', err));
		/**
		 * Fetch movies from the API
		 * and set the state
		 * with the fetched movies
		 */
		getPopularMovies()
			.then((res) => {
				/**
				 * Set state with the fetched movies
				 */
				setMovies(res.results);
				/**
				 * Set attributes with the fetched movies
				 */
				setAttributes({ movieData: res.results });
			})
			.catch((err) => console.log('err', err));
	}, []);
	return (
		<div {...blockProps}>
			<SidebarControl props={props} />
			{/* <MyAnimatedNotice /> */}
			{/* <CardComponent /> */}
			<div className="movie-list">
				{movies &&
					movies.map((movie) => (
						<MovieCard key={movie.id} movie={movie} />
					))}
			</div>
		</div>
	);
}
