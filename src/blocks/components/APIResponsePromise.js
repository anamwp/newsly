/**
 * Manage API response promise
 * @param {string} url - URL of the API
 * @returns
 */
const APIResponsePromise = async (url = '') => {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization:
				'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDQxMzQ5MmRiNWUyZTRjYTVlOTM0MDJjYTYyM2ZjYSIsIm5iZiI6MTcxOTIwNzU0OC45NzY5OCwic3ViIjoiNjY3OTA0YWNlZmRiOGMxNzc0MGI1MmZkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3LtMcOLpN8GfR8UiFDFPUYYHJVft69TrEzPssuTqnBA',
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
