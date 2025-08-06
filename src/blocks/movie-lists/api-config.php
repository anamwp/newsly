<?php
/**
 * API Configuration for Movie Lists Block
 *
 * @package gutenberg-starter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Enqueue block assets with localized API settings.
 */
function gutenberg_starter_enqueue_movie_assets() {
	// Check if the block is in use before localizing data.
	if ( has_block( 'gutenberg-starter/movie-lists' ) || is_admin() ) {
		// Get API key from settings.
		$api_key = get_option( 'gutenberg_starter_movie_api_key', '' );
		
		// Localize the API settings.
		wp_localize_script(
			'gutenberg-starter-movie-lists', // Block script handle.
			'movieListsBlockConfig',
			array(
				'apiKey'       => $api_key,
				'apiUrl'       => 'https://api.themoviedb.org/3',
				'imageBaseUrl' => 'https://image.tmdb.org/t/p/w500',
				'nonce'        => wp_create_nonce( 'gutenberg-starter-movie-lists' ),
			)
		);
	}
}
add_action( 'enqueue_block_assets', 'gutenberg_starter_enqueue_movie_assets' );