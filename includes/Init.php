<?php
	namespace Anam\GutenbergStarter;

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
	}
}


