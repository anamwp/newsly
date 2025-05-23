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
 * Register and localize API settings.
 */
function gutenberg_starter_register_movie_api_settings() {
	// Register settings.
	register_setting(
		'gutenberg_starter_movie_settings',
		'gutenberg_starter_movie_api_key',
		array(
			'type'              => 'string',
			'description'       => __( 'The Movie Database API Key', 'gutenberg-starter' ),
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => false, // Don't expose in REST API for security.
			'default'           => '',
		)
	);

	// Add settings page.
	add_action( 'admin_menu', 'gutenberg_starter_add_movie_settings_page' );
}
add_action( 'init', 'gutenberg_starter_register_movie_api_settings' );

/**
 * Add settings page under Settings menu.
 */
function gutenberg_starter_add_movie_settings_page() {
	add_options_page(
		__( 'Movie Lists Block Settings', 'gutenberg-starter' ),
		__( 'Movie Lists Block', 'gutenberg-starter' ),
		'manage_options',
		'gutenberg-starter-movie-settings',
		'gutenberg_starter_movie_settings_page'
	);
}

/**
 * Settings page callback.
 */
function gutenberg_starter_movie_settings_page() {
	// Get the API key.
	$api_key = get_option( 'gutenberg_starter_movie_api_key', '' );
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form method="post" action="options.php">
			<?php settings_fields( 'gutenberg_starter_movie_settings' ); ?>
			<table class="form-table">
				<tr>
					<th scope="row">
						<label for="gutenberg_starter_movie_api_key">
							<?php esc_html_e( 'The Movie Database API Key', 'gutenberg-starter' ); ?>
						</label>
					</th>
					<td>
						<input type="text" 
							id="gutenberg_starter_movie_api_key" 
							name="gutenberg_starter_movie_api_key" 
							value="<?php echo esc_attr( $api_key ); ?>" 
							class="regular-text" 
						/>
						<p class="description">
							<?php esc_html_e( 'Enter your API key from The Movie Database (TMDb). Get one at https://www.themoviedb.org/settings/api.', 'gutenberg-starter' ); ?>
						</p>
					</td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
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
				'apiKey'      => $api_key,
				'apiUrl'      => 'https://api.themoviedb.org/3',
				'imageBaseUrl' => 'https://image.tmdb.org/t/p/w500',
				'nonce'       => wp_create_nonce( 'gutenberg-starter-movie-lists' ),
			)
		);
	}
}
add_action( 'enqueue_block_assets', 'gutenberg_starter_enqueue_movie_assets' );