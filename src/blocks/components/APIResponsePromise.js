/**
 * Manage API response promise
 * @param {string} url - URL of the API
 * @returns
 */
const APIResponsePromise = async (url = '') => {
	// Get API token from environment variables (localized in gutenberg-starter.php)
	const movieBearerToken = window.envVars?.MOVIE_BEARER_TOKEN || '';

	if (!movieBearerToken) {
		throw new Error(
			'Movie API token is not configured. Please set MOVIE_BEARER_TOKEN in your .env file or WordPress admin (Settings > Gutenberg Starter).'
		);
	}

	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${movieBearerToken}`,
		},
	};
	const getMovieAPIResponse = await fetch(url, options);
	const getMovieAPIResponseJSON = await getMovieAPIResponse.json();
	if (getMovieAPIResponseJSON.success === false) {
		throw new Error(getMovieAPIResponseJSON.status_message);
	}
	return getMovieAPIResponseJSON;
};

export default APIResponsePromise;
