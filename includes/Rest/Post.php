<?php

	namespace Anam\GutenbergStarter\REST;
/**
 * Title.
 *
 * @since 1.0.0
 */
class Post {
	static $instance;
	/**
	 * Construct of Class
	 */
	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_rest_fields' ) );
	}
	/**
	 * Construct of Class
	 */
	public function register_rest_fields() {
		register_rest_route('anam-gutenberg-starter-block/v1', '/add-meta/(?P<post_id>\d+)', [
			'methods'  => 'POST',
			'callback' => array( $this, 'gs_handle_add_block_meta' ),
			'args'     => [
				'post_id' => [
					'validate_callback' => function ($param) {
						return is_numeric($param);
					}
				]
			],
			'permission_callback' => '__return_true',
		]);
	}
	/**
	 * Undocumented function
	 *
	 * @param \WP_REST_Request $request
	 * @return void
	 */
	public function gs_handle_add_block_meta( \WP_REST_Request $request ) {
		$post_id = $request['post_id']; // Extract post_id from URL
		$body_params = $request->get_json_params(); // Extract data from body
		
		/**
		 * Check if post exists.
		 */
		$post = get_post($post_id);
		if (!$post) {
			return new \WP_Error('post_not_found', 'Post not found', ['status' => 404]);
		}
		/**
		 * Check if block name exists.
		 */
		if (!isset($body_params['blockSlug'])) {
			return new \WP_Error('missing_data', 'Block name is required', ['status' => 400]);
		}
		// Todo: check if that block exists in the plugin or not
		$block_slug  = sanitize_text_field($body_params['blockSlug']);
		// $another_key = isset($body_params['anotherKey']) ? sanitize_text_field($body_params['anotherKey']) : '';
		
		/**
		 * Check if meta already exists.
		 */
		$block_meta_key = "_has_{$block_slug}_block";
		$existing_meta = get_post_meta($post_id, $block_meta_key, true);
		if ($existing_meta) {
			return new \WP_Error('meta_exists', 'Meta already exists', ['status' => 200]);
		}
		
		/**
		 * Add meta to the post.
		 */
		if ($post_id && $block_slug) {
			update_post_meta($post_id, $block_meta_key, true);
			return new \WP_REST_Response([
				'message' => 'Meta added successfully',
				'post_id' => $post_id,
				'block_slug' => $block_slug,
			], 200);
		}
		// update_post_meta($post_id, '_myplugin_another_key', $another_key);
		
	}

}