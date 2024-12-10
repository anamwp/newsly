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
		 * Undocumented function
		 *
		 * @return void
		 */
		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			self::init_wc_cli();
		}
	}

	public static function init_wc_cli() {
		$wc_cli_instance = CLI\WC\Class_Import_Products::init();
		WP_CLI::add_command( 'gs import-products', array( $wc_cli_instance, 'import_products' ) );
		WP_CLI::add_command( 'gs delete-products', array( $wc_cli_instance, 'delete_products' ) );
	}
}
