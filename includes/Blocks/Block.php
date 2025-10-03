<?php
	namespace Anam\Newsly\Blocks;

class Block {
	/**
	 * Undocumented variable
	 *
	 * @var [type]
	 */
	private static $instance;
	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	public $movie_list_callback_instance;
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
		register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/single-post' );
		register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/featured-posts' );
		register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/latest-posts' );
		// register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/category-post' );
		// register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/post-lists-tab' );
		// register_block_type_from_metadata( NEWSLY_PATH . '/build/blocks/smart-category-posts' );
		// register_block_type_from_metadata(
		// 	NEWSLY_PATH . '/build/blocks/movie-lists',
		// 	array(
		// 		'render_callback' => array( $this, 'movie_lists_render_frontend_callback' ),
		// 	)
		// );
	}
	
}

?>
