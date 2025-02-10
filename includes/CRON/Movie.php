<?php
namespace Anam\GutenbergStarter\CRON;
/**
 * Summary.
 *
 * @since Version 3 digits
 */
class Movie {
	/**
	 * Instance of Class
	 *
	 * @var [type]
	 */
	private static $instance;
	/**
	 * Init of Class
	 */
	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * Construct of Class
	 */
	public function __construct() {
		add_action('wp', array( $this, 'schedule_movie_update_cron'));
		add_action('update_movie_block_event', array( $this, 'update_movie_block'));
	}
	/**
	 * Schedule Movie Update Cron
	 */
	public function schedule_movie_update_cron() {
		if (!wp_next_scheduled('update_movie_block_event')) {
			wp_schedule_event(time(), 'daily', 'update_movie_block_event');
		}
	}
	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	public function update_movie_block() {

		/**
		 * Get latest movies from TMDB
		 */
		$get_movie_data = wp_remote_get( 'https://api.themoviedb.org/3/movie/now_playing?api_key=94413492db5e2e4ca5e93402ca623fca&language=en-US&page=1' );

		$latest_movie_data_id_arr = [];
		$latest_movie_data_arr = [];
		if ( is_array( $get_movie_data ) && ! is_wp_error( $get_movie_data ) ) {
			$requested_movie_content = json_decode( $get_movie_data['body'] );
			$latest_movie_data_arr = $requested_movie_content->results;
			foreach ( $requested_movie_content->results as $movie ) {
				$latest_movie_data_id_arr[] = $movie->id;
			}
		}
		// echo wp_json_encode( $new_movie_data_id_arr ) . PHP_EOL;

		/**
		 * Todo:
		 * 1. Get all the pages where theatre movie block is used
		 * 
		 */

		/**
		 * Get all the pages where theatre movie block is used.
		 */
		$posts = get_posts(array(
			'post_type' => 'page',
			'posts_per_page' => -1,
			'meta_query' => array(
				array(
					'key' => '_has_theatres-movies_block',
					'value' => '1',
				)
			)
		));
		if( $posts ){
			foreach( $posts as $post ){
				$post_id = $post->ID;
				$post_content = $post->post_content;
				$updated = false;
				// dump('post_id ============', $post_id);

				/**
				 * Find all Gutenberg movie blocks inside post_content.
				 */
				if ( preg_match_all( '/<!-- wp:anam-gutenberg-starter-block\/theatres-movies ({.*?}) -->/', $post_content, $matches, PREG_OFFSET_CAPTURE ) ) {
					// insert post content to a file for debugging purpose
					// with readble formate
					// $file_url = plugin_dir_path( __FILE__ ) . 'post_content.txt';
					// $status = file_put_contents( $file_url, $post_content );
					// dump('file put content status for post content', $status);
					// dump( 'matches', $matches );
					// dump( '=====================' );
					
					/**
					 * Loop through all the blocks found in the post_content.
					 */
					foreach ( $matches[1] as $match ) {
						$block_existing_movie_id_arr = [];
						$new_movie_data_id_arr = [];
						$block_json = $match[0];
						$block_pos = $match[1];
		
						$block_data = json_decode( $block_json, true );
						$fetched_movies_attr = $block_data['fetchedMovies'];
						foreach ( $fetched_movies_attr as $fetchedMovie) {
							$block_existing_movie_id_arr[] = $fetchedMovie['id'];
						}
						// compare old and new movie data
						foreach ( $block_existing_movie_id_arr as $movie_id ) {
							if ( ! in_array( $movie_id, $latest_movie_data_id_arr ) ) {
								$new_movie_data_id_arr[] = $movie_id;
							}
						}
						if( count( $new_movie_data_id_arr ) > 0 ){
							/**
							 * If $block_data found and $block_data['fetchedMovies'] found
							 * Update the block data with new movie data
							 */
							if ($block_data && isset($block_data['fetchedMovies'])) {
								$block_data['fetchedMovies'] = $latest_movie_data_arr;
								$block_json_updated = json_encode($block_data, true);
								/**
								 * Replace the old block data with the new one.
								 */
								$post_content = substr_replace(
									$post_content,
									$block_json_updated,
									$block_pos,
									strlen( $block_json )
								);
								/**
								 * Insert updated post content to a file for debugging purpose.
								 */
								$updated_file_url = plugin_dir_path( __FILE__ ) . 'updated_post_content.txt';
								$status = file_put_contents( $updated_file_url, $post_content );
								// dump( 'updated_content', $status );
								/**
								 * Set $updated to true
								 */
								$updated = true;
							}
						} else {
							$updated = false;
							/**
							 * If $block_data found and $block_data['fetchedMovies'] found
							 */
							// if ( $block_data && isset( $block_data['fetchedMovies'] ) ) {
							// 	$block_data['fetchedMovies'] = $latest_movie_data_arr;
							// 	$block_json_updated = json_encode( $block_data, true );
							// 	$post_content_updated = substr_replace(
							// 		$post_content,
							// 		$block_json_updated,
							// 		$block_pos,
							// 		strlen($block_json)
							// 	);
							// 	$updated_file_url = plugin_dir_path( __FILE__ ) . 'updated_post_content.txt';
							// 	$status = file_put_contents( $updated_file_url, $post_content_updated );
							// 	dump('file put content status for updated_content', $status);
							// 	dump('Nothing to update.');
							// }
						}
						// $updated = true;
					}
					// dump('updated', $updated);
				}
				else{
					print_r('No block found.'. PHP_EOL);
				}
				if ($updated) {
					// Update the post with new block data
					$status = wp_update_post(array(
						'ID'           => $post->ID,
						'post_content' => $post_content,
					));
					print_r(`Post Updated. Id - {$post->ID} and status is {$status}`);
				}else{
					print_r( 'Everything is up to date for post id ' . $post->ID . PHP_EOL );
				}
			}
		}
	}
}
