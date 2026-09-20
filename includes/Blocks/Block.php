<?php
/**
 * Block registration.
 *
 * @package Anam\Newsly
 */

namespace Anam\Newsly\Blocks;

/**
 * Registers all of Newsly's block types.
 */
class Block {

	/**
	 * Singleton instance.
	 *
	 * @var Block|null
	 */
	private static $instance;
	/**
	 * Initiate class.
	 *
	 * @return Block
	 */
	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * Initiate Class
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_block' ) );
	}
	/**
	 * Register Block
	 *
	 * @return void
	 */
	public function register_block() {
		if ( ! is_dir( NEWSLY_PATH . '/build' ) ) {
			if ( is_admin() ) {
				add_action( 'admin_notices', array( $this, 'missing_build_notice' ) );
			}
			return;
		}
		/**
		 * Register block type from metadata
		 */
		register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/featured-posts' );
		register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/latest-posts' );
		register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/category-post' );
		register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/post-lists-tab' );
	}

	/**
	 * Warn admins that the block assets haven't been built, instead of the
	 * blocks silently failing to register.
	 *
	 * @return void
	 */
	public function missing_build_notice() {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return;
		}
		printf(
			'<div class="notice notice-error"><p>%s</p></div>',
			esc_html__( 'Newsly: no built block assets found in build/. Run "npm ci && npm run build" from the plugin directory, or install a release zip from the Releases page instead of the repository archive.', 'newsly' )
		);
	}
}
