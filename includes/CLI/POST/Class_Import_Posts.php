<?php
namespace Anam\GutenbergStarter\CLI\POST;

/**
 * Summary.
 *
 * Description.
 *
 * @since Version 3 digits
 */
class Class_Import_Posts {
	/**
	 * Instance variable
	 */
	private static $instance;
	/**
	 * API URL
	 */
	private static $api_url = 'https://dummyjson.com/posts';
	/**
	 * Instance of Class_Import_Products
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Fetch products from dummyjson.com/products
	 *
	 * @return void
	 */
	public function gs_fetch_posts_from_api() {
		$response = wp_remote_get( self::$api_url );
		if ( is_wp_error( $response ) ) {
			\WP_CLI::error( 'Failed to fetch data from the API' );
			return array();
		}
		$response_body     = wp_remote_retrieve_body( $response );
		$response_body_obj = json_decode( $response_body, true );
		$post_arr          = $response_body_obj['posts'];
		/**
		 * If no posts found then return error
		 */
		if ( empty( $post_arr ) ) {
			\WP_CLI::error( 'No posts found' );
			return array();
		}
		return $post_arr;
	}
	/**
	 * Check if product exists
	 *
	 * @param [string] $sku - product sku.
	 * @return void
	 */
	public function gs_check_post_exists( $post_title ) {
		$post_id = '';
		// Set up WP_Query arguments
		$query_args = array(
			'post_type'      => 'post',      // Check only 'post' post type
			'post_status'    => 'any',      // Check posts with any status
			'title'          => $post_title, // Match the post title
			'posts_per_page' => 1,          // Limit to 1 result for performance
		);

		// Query the database
		$query = new \WP_Query( $query_args );

		// Check if a post was found
		if ( $query->have_posts() ) {
			$query->the_post();
			$post_id = get_the_ID(); // Get the ID of the matched post
			wp_reset_postdata();     // Reset post data
			// return $post_id;       // Return the post ID
			return array(
				'post_id'     => $post_id,
				'post_status' => true,
			);
		} else {
			return array(
				'post_id'     => false,
				'post_status' => false,
			);
		}
	}

	private function gs_manage_posts( $post ) {
		$post_exists = $this->gs_check_post_exists( $post['title'] );
		if ( $post_exists['post_status'] ) {
			\WP_CLI::warning( 'Post already exists: ' . $post['title'] );
			return false;
		} else {
			\WP_CLI::line( 'Importing post: ' . $post['title'] );
			$post_id = wp_insert_post(
				array(
					'post_title'   => $post['title'],
					'post_content' => $post['body'],
					'post_status'  => 'publish',
					'post_author'  => 1,
					'post_type'    => 'post',
				)
			);
			/**
			 * if something wrong then return false
			 */
			if ( is_wp_error( $post_id ) || ! $post_id ) {
				\WP_CLI::warning( 'Failed to insert post: ' . $post['title'] );
				return false;
			}
			\WP_CLI::log( "Post is inserted. Now adding Meta for - {$post['title']}" );

			if ( ! empty( $post['tags'] ) ) {
				$tag_assign_status = wp_set_object_terms( $post_id, $post['tags'], 'post_tag' );
				if ( is_wp_error( $tag_assign_status ) ) {
					\WP_CLI::warning( 'Failed to assign tags: ' . $post['category'] );
				} else {
					\WP_CLI::log( 'Tag assigned on - ' . $post['title'] );
				}
			}
			/**
			 * Log the info in the wp-cli
			 */
			\WP_CLI::success( 'Post inserted: -' . $post['title'] );
		}
	}

	public function import_posts() {
		$posts_arr = $this->gs_fetch_posts_from_api();
		if ( empty( $posts_arr ) ) {
			\WP_CLI::error( 'No posts found' );
		}
		foreach ( $posts_arr as $post ) {
			if ( $post ) {
				$this->gs_manage_posts( $post );
			}
		}
	}

	public function delete_posts() {
		$posts_arr = $this->gs_fetch_posts_from_api();
		if ( empty( $posts_arr ) ) {
			\WP_CLI::error( 'No posts found' );
		}
		foreach ( $posts_arr as $post ) {
			if ( $post ) {
				$post_exists = $this->gs_check_post_exists( $post['title'] );

				if ( $post_exists['post_status'] ) {
					$this->manage_delete_posts( $post_exists['post_id'] );
				} else {
					\WP_CLI::warning( 'Post not found: ' . $post['title'] );
				}
			}
		}
	}
	private function manage_delete_posts( $post_id ) {
		wp_delete_post( $post_id, true );
		\WP_CLI::success( 'Product deleted: ' . $post_id );
	}
}
