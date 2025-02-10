<?php
	namespace Anam\GutenbergStarter;

use WP_CLI;

class Init {
	public function __construct() {
		/**
		 * init post types
		 */
		PostType\Demo::init();
		PostType\Breweries::init();
		/**
		 * init shortcodes
		 */
		Shortcode\Demo::init();
		Shortcode\Breweries::init();
		/**
		 * gutenberg block
		 */
		Blocks\Block::init();
		/**
		 * Plugin Option Panel
		 */
		Admin\Options::init();
		/**
		 * Product Tab
		 */
		Admin\Product_Tab::init();
		/**
		 * REST API
		 */
		REST\Post::init();
		/**
		 * Cron
		 */
		CRON\Movie::init();
		/**
		 * Undocumented function
		 *
		 * @return void
		 */
		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			// self::init_wc_cli();
			// self::init_post_cli();
		}
	}

	public static function init_wc_cli() {
		$wc_cli_instance = CLI\WC\Class_Import_Products::init();
		WP_CLI::add_command( 'gs import-products', array( $wc_cli_instance, 'import_products' ) );
		WP_CLI::add_command( 'gs delete-products', array( $wc_cli_instance, 'delete_products' ) );
	}
	public static function init_post_cli() {
		$post_cli_instance = CLI\POST\Class_Import_Posts::init();
		WP_CLI::add_command( 'gs import-posts', array( $post_cli_instance, 'import_posts' ) );
		WP_CLI::add_command( 'gs delete-posts', array( $post_cli_instance, 'delete_posts' ) );

		$post_cli_instance = CLI\POST\Class_Import_All_Posts::init();
		WP_CLI::add_command( 'gs import-all-posts', array( $post_cli_instance, 'import_posts' ) );
		WP_CLI::add_command( 'gs delete-all-posts', array( $post_cli_instance, 'delete_posts' ) );
	}
}
