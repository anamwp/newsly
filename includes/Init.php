<?php
	namespace Anam\GutenbergStarter;

class Init {
	public function __construct() {
		/**
		 * init post types
		 */
		PostType\Demo::init();
		/**
		 * init shortcodes
		 */
		Shortcode\Demo::init();
		/**
		 * gutenberg block
		 */
		Blocks\Block::init();
	}
}


