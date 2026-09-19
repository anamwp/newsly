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
		/**
		 * Register block type from metadata
		 */
		register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/featured-posts' );
		register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/latest-posts' );
		register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/category-post' );
		register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/post-lists-tab' );
	}
}
