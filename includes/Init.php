<?php
/**
 * Includes fiels.
 *
 * All necessary files are included here.
 *
 * @since 1.0.0
 * @package Anam\GutenbergStarter
 */

namespace Anam\GutenbergStarter;
/**
 * Inilize all necessary files.
 */
class Init {
	/**
	 * Class constructor
	 */
	public function __construct() {
		/**
		 * Init post types
		 */
		PostType\Demo::init();
		PostType\Breweries::init();
		/**
		 * Init shortcodes.
		 */
		Shortcode\Demo::init();
		Shortcode\Breweries::init();
		/**
		 * Gutenberg block
		 */
		Blocks\Block::init();
		Blocks\Inc\Class_Post_List_Tab_Callback::init();
		/**
		 * Plugin Option Panel under settings menu.
		 */
		Admin\Options::init();
		/**
		 * WooCommerce Product
		 * Add custom tab and few extra fields to product add/edit page
		 */
		Admin\Product_Tab::init();
		/**
		 * REST API
		 */
		REST\Post_Meta::init();
		/**
		 * Cron
		 * Command - wp cron event run update_movie_block_event
		 */
		CRON\Movie::init();
	}
}
