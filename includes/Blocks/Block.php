<?php
/**
 * Block registration.
 *
 * @package Anam\Newsly
 */

namespace Anam\Newsly\Blocks;

use WP_Block_Type;

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
	 * Names of the blocks registered from build/blocks/<name>.
	 *
	 * @var string[]
	 */
	private static $block_names = array(
		'featured-posts',
		'latest-posts',
		'category-post',
		'post-lists-tab',
	);

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
	 * Get the directory blocks are registered from.
	 *
	 * Filterable so tests can point registration at a fixture directory,
	 * or at a path that doesn't exist, without touching the real build/.
	 *
	 * @return string
	 */
	public static function get_build_path() {
		return apply_filters( 'newsly_build_path', NEWSLY_PATH . '/build' );
	}

	/**
	 * Register Block
	 *
	 * @return void
	 */
	public function register_block() {
		$build_path = self::get_build_path();
		if ( ! is_dir( $build_path ) ) {
			if ( is_admin() ) {
				add_action( 'admin_notices', array( $this, 'missing_build_notice' ) );
			}
			return;
		}
		foreach ( self::$block_names as $block_name ) {
			$block = register_block_type_from_metadata( $build_path . '/blocks/' . $block_name );
			if ( ! ( $block instanceof WP_Block_Type ) ) {
				continue;
			}
			foreach ( $block->editor_script_handles as $handle ) {
				wp_set_script_translations( $handle, 'newsly', NEWSLY_PATH . '/languages' );
			}
		}
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
