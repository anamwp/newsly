<?php
/**
 * Add and delete meta by Rest Reqeust.
 *
 * Description.
 *
 * @since 1.0.0
 * @package Anam\GutenbergStarter\REST
 */

namespace Anam\GutenbergStarter\REST;

/**
 * Class to Handle rest request regarding add and delete meta
 */
class Post_Meta {
	/**
	 * Class instance.
	 *
	 * @var [type]
	 */
	private static $instance;
	/**
	 * Class initiator
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
		add_action( 'rest_api_init', array( $this, 'gs_register_rest_route_callback' ) );
	}
	/**
	 * Register rest routes.
	 */
	public function gs_register_rest_route_callback() {
		/**
		 * Add meta route.
		 */
		register_rest_route(
			'anam-gutenberg-starter-block/v1',
			'/add-meta/(?P<post_id>\d+)',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'gs_handle_add_block_meta_callback' ),
				'args'                => array(
					'post_id' => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
					),
				),
				'permission_callback' => '__return_true',
			)
		);
		/**
		 * Remove meta route.
		 */
		register_rest_route(
			'anam-gutenberg-starter-block/v1',
			'/remove-meta/(?P<post_id>\d+)',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'gs_handle_remove_block_meta_callback' ),
				'args'                => array(
					'post_id' => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
					),
				),
				'permission_callback' => '__return_true',
			)
		);
	}
	/**
	 * Callback function to add meta to post.
	 *
	 * @param \WP_REST_Request $request - Request array.
	 * @return Array
	 */
	public function gs_handle_add_block_meta_callback( \WP_REST_Request $request ) {
		$post_id     = $request['post_id']; // Extract post_id from URL.
		$body_params = $request->get_json_params(); // Extract data from body.
		/**
		 * Check if post exists.
		 */
		$post = get_post( $post_id );
		if ( ! $post ) {
			return new \WP_REST_Response(
				array(
					'message' => 'Post not found',
					'status'  => 404,
				),
				404
			);
		}
		/**
		 * Check if block name exists.
		 */
		if ( ! isset( $body_params['blockSlug'] ) ) {
			return new \WP_REST_Response(
				array(
					'message' => 'Block name is required',
					'status'  => 400,
				),
				400
			);
		}
		// Todo: check if that block exists in the plugin or not.
		$block_slug = sanitize_text_field( $body_params['blockSlug'] );
		// phpcs:ignore $another_key = isset($body_params['anotherKey']) ? sanitize_text_field($body_params['anotherKey']) : '';

		/**
		 * Check if meta already exists.
		 */
		$block_meta_key = "_has_{$block_slug}_block";
		$existing_meta  = get_post_meta( $post_id, $block_meta_key, true );
		if ( $existing_meta ) {
			return new \WP_REST_Response(
				array(
					'message'    => 'Meta already exists',
					'post_id'    => $post_id,
					'block_slug' => $block_slug,
					'status'     => 200,
				),
				200
			);
		}
		/**
		 * Add meta to the post.
		 */
		if ( $post_id && $block_slug ) {
			update_post_meta( $post_id, $block_meta_key, true );
			return new \WP_REST_Response(
				array(
					'message'    => 'Meta added successfully',
					'post_id'    => $post_id,
					'block_slug' => $block_slug,
					'status'     => 200,
				),
				200
			);
		}
		// phpcs:ignore update_post_meta($post_id, '_myplugin_another_key', $another_key);
	}
	/**
	 * Callback function to remove meta from post.
	 *
	 * @param \WP_REST_Request $request - Request array.
	 * @return Array
	 */
	public function gs_handle_remove_block_meta_callback( \WP_REST_Request $request ) {
		$post_id     = $request['post_id']; // Extract post_id from URL.
		$body_params = $request->get_json_params(); // Extract data from body.
		/**
		 * Check if post exists.
		 */
		$post = get_post( $post_id );
		if ( ! $post ) {
			return new \WP_REST_Response(
				array(
					'message' => 'Post not found',
					'status'  => 404,
				),
				404
			);
		}
		/**
		 * Check if block name exists.
		 */
		if ( ! isset( $body_params['blockSlug'] ) ) {
			return new \WP_REST_Response(
				array(
					'message' => 'Block name is required',
					'status'  => 400,
				),
				400
			);
		}
		// Todo: check if that block exists in the plugin or not.
		$block_slug = sanitize_text_field( $body_params['blockSlug'] );
		/**
		 * Check if meta already exists.
		 */
		$block_meta_key = "_has_{$block_slug}_block";
		$existing_meta  = get_post_meta( $post_id, $block_meta_key, true );
		if ( $existing_meta ) {
			delete_post_meta( $post_id, $block_meta_key );
			return new \WP_REST_Response(
				array(
					'message'    => 'Meta removed successfully',
					'post_id'    => $post_id,
					'block_slug' => $block_slug,
					'status'     => 200,
				),
				200
			);
		} else {
			return new \WP_REST_Response(
				array(
					'message' => 'Meta not exists',
					'status'  => 400,
				),
				400
			);
		}
	}
}
