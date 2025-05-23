/**
 * API utility functions for movie lists block
 */

/**
 * Get API configuration from WordPress localized data
 * @returns {Object} API configuration
 */
export const getApiConfig = () => {
    // This assumes you've localized the data from PHP
    // Replace with your actual localization handle
    return window.movieListsBlockConfig || {
        apiKey: '',
        apiUrl: 'https://api.themoviedb.org/3',
        imageBaseUrl: 'https://image.tmdb.org/t/p/w500',
    };
};

/**
 * Get popular movies from the API
 * @param {string} page - Page number
 * @returns {Promise<Object>} Movie data
 */
export const getPopularMovies = async (page = 1) => {
    try {
        const { apiKey, apiUrl } = getApiConfig();
        
        if (!apiKey) {
            throw new Error('API key is not configured');
        }

        const movieAPIUrl = `${apiUrl}/movie/popular`;
        const apiResponse = await fetch(
            `${movieAPIUrl}?api_key=${apiKey}&language=en-US&page=${page}`
        );
        
        const apiResponseJSON = await apiResponse.json();
        
        if (apiResponseJSON.success === false) {
            throw new Error(apiResponseJSON.status_message);
        }
        
        return apiResponseJSON;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        throw error;
    }
};

/**
 * Get movie genres from the API
 * @returns {Promise<Object>} Genre data
 */
export const getMovieGenres = async () => {
    try {
        const { apiKey, apiUrl } = getApiConfig();
        
        if (!apiKey) {
            throw new Error('API key is not configured');
        }
        
        // Use consistent authentication method
        const genreUrl = `${apiUrl}/genre/movie/list`;
        const apiResponse = await fetch(
            `${genreUrl}?api_key=${apiKey}&language=en-US`
        );
        
        const apiResponseJSON = await apiResponse.json();
        
        if (apiResponseJSON.success === false) {
            throw new Error(apiResponseJSON.status_message);
        }
        
        return apiResponseJSON;
    } catch (error) {
        console.error('Error fetching movie genres:', error);
        throw error;
    }
};