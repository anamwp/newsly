<?php
/**
 * Plugin Name: Anam Gutenberg Starter
 * Plugin URI: https://anam.rocks
 * Description: A starter plugin to start your big idea.
 * Version: 1.0
 * Author: Anam
 * Author URI: https://anam.rocks
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: 'anam-gutenbergp-starter'
 */
// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';

final class Anam_Gutenberg_Starter {

	/**
	 * plugin version
	 */
	const ANAM_GUTENBERG_STARTER_VERSION = '1.0';
	/**
	 * construction of this plugin
	 */
	private function __construct() {
		$this->define_constants();
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		add_action( 'plugins_loaded', array( $this, 'load_plugin_resources' ) );
	}
	/**
	 * Initialize the plugin
	 *
	 * @return void
	 */
	public static function init() {
		static $instance = false;
		if ( ! $instance ) {
			$instance = new self();
		}
		return $instance;
	}
	/**
	 * Load plugin text domain
	 *
	 * @return void
	 */
	public function load_text_domain() {
		load_plugin_textdomain( 'anam-gutenberg-starter' );
	}
	/**
	 * define plugin
	 * default constants
	 *
	 * @return void
	 */
	public function define_constants() {
		/**
		 * return plugin version
		 */
		define( 'ANAM_GUTENBERG_STARTER_VERSION', self::ANAM_GUTENBERG_STARTER_VERSION );
		/**
		 * return the main file name
		 * C:\xampp\htdocs\devplugin\wp-content\plugins\gutenberg-starter\gutenberg-starter.php
		 */
		define( 'ANAM_GUTENBERG_STARTER_FILE', __FILE__ );
		/**
		 * return the plugin director
		 * C:\xampp\htdocs\devplugin\wp-content\plugins\gutenberg-starter
		 */
		define( 'ANAM_GUTENBERG_STARTER_PATH', __DIR__ );
		/**
		 * return the plugin directory with host
		 * http://localhost/devplugin/wp-content/plugins/gutenberg-starter
		 */
		define( 'ANAM_GUTENBERG_STARTER_URL', plugins_url( '', ANAM_GUTENBERG_STARTER_FILE ) );
		define( 'ANAM_GUTENBERG_STARTER_DIR_URL', plugin_dir_url( __FILE__ ) );
		/**
		 * return the asset folder director
		 * http://localhost/devplugin/wp-content/plugins/gutenberg-starter/assets
		 */
		define( 'ANAM_GUTENBERG_STARTER_ASSETS', ANAM_GUTENBERG_STARTER_URL . '/build' );
		define( 'ANAM_GUTENBERG_STARTER_DIR_ASSETS', ANAM_GUTENBERG_STARTER_DIR_URL . 'build' );

	}
	/**
	 * add installation time
	 * and plugin version
	 * while active the plugin
	 *
	 * @return void
	 */
	public function activate() {
		if ( ! get_option( 'anam_gutenberg_starter_installed' ) ) {
			update_option( 'anam_gutenberg_starter_installed', time() );
		}
		update_option( 'anam_gutenberg_starter_version', ANAM_GUTENBERG_STARTER_VERSION );
	}
	/**
	 * Load plugin resources
	 *
	 * @return void
	 */
	public function load_plugin_resources() {
		new Anam\GutenbergStarter\Init();
	}
}

/**
 * Initilize the main plugin
 *
 * @return \Guest_Post_Submission
 */
function anam_gutenberg_starter() {
	 return anam_gutenberg_Starter::init();
}
/**
 * kick start the plugin
 */
anam_gutenberg_starter();


