<?php
/**
 * Plugin Name: Newsly
 * Plugin URI: https://anamhossain.dev/
 * Description: Dynamic Gutenberg blocks for displaying news posts, categories, and featured content.
 * Version: 1.0.1
 * Requires at least: 6.1
 * Requires PHP: 8.0
 * Author: Anam
 * Author URI: https://profiles.wordpress.org/theanamhossain/
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: newsly
 * Domain Path: /languages
 *
 * @package Anam\Newsly
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Autoload vendor folder
 */
require_once __DIR__ . '/vendor/autoload.php';

/**
 * Main plugin bootstrap class.
 */
final class Newsly {


	/**
	 * Plugin version.
	 */
	const NEWSLY_VERSION = '1.0.1';
	/**
	 * Construction of this plugin.
	 */
	private function __construct() {
		$this->define_constants();
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		add_action( 'plugins_loaded', array( $this, 'load_plugin_resources' ) );
	}
	/**
	 * Initialize the plugin.
	 *
	 * @return self
	 */
	public static function init() {
		static $instance = false;
		if ( ! $instance ) {
			$instance = new self();
		}
		return $instance;
	}
	/**
	 * Define plugin
	 * default constants
	 *
	 * @return void
	 */
	public function define_constants() {
		/**
		 * Return plugin version.
		 */
		define( 'NEWSLY_VERSION', self::NEWSLY_VERSION );
		/**
		 * Return the main file name.
		 */
		define( 'NEWSLY_FILE', __FILE__ );
		define( 'NEWSLY_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ) );
		/**
		 * Return the plugin directory.
		 */
		define( 'NEWSLY_PATH', __DIR__ );
		/**
		 * Return the plugin directory URL.
		 */
		define( 'NEWSLY_URL', plugins_url( '', NEWSLY_FILE ) );
		define( 'NEWSLY_DIR_URL', plugin_dir_url( __FILE__ ) );
		/**
		 * Return the built asset folder URL/path.
		 */
		define( 'NEWSLY_ASSETS', NEWSLY_URL . '/build' );
		define( 'NEWSLY_DIR_ASSETS', NEWSLY_DIR_URL . 'build' );
	}
	/**
	 * Add installation time
	 * and plugin version
	 * while active the plugin
	 *
	 * @return void
	 */
	public function activate() {
		if ( ! get_option( 'newsly_installed' ) ) {
			update_option( 'newsly_installed', time() );
		}
		update_option( 'newsly_version', NEWSLY_VERSION );
	}
	/**
	 * Load plugin resources
	 *
	 * @return void
	 */
	public function load_plugin_resources() {
		new Anam\Newsly\Init();
	}
}

/**
 * Manage fonts in the editor
 *
 * Self-hosted: only Poppins 500 (normal) is used anywhere in the
 * blocks' markup (always paired with the `font-poppins font-medium`
 * classes), so that's the only weight bundled.
 *
 * ref: https://developer.wordpress.org/block-editor/how-to-guides/enqueueing-assets-in-the-editor/
 *
 * @return void
 */
function newsly_handle_google_fonts() {
	wp_enqueue_style( 'newsly-fonts', plugins_url( 'assets/fonts/fonts.css', NEWSLY_FILE ), array(), NEWSLY_VERSION );
}
add_action( 'enqueue_block_editor_assets', 'newsly_handle_google_fonts' );
add_action( 'wp_enqueue_scripts', 'newsly_handle_google_fonts' );

/**
 * Enqueue script for ajax pagination
 *
 * @return void
 */
function newsly_enqueue_ajax_pagination_script() {
	wp_enqueue_script( 'jquery' );
	wp_localize_script(
		'jquery',
		'anamajaxpagination',
		array(
			'ajaxurl'           => admin_url( 'admin-ajax.php' ),
			'newsly_ajax_nonce' => wp_create_nonce( 'newsly_ajax_nonce' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'newsly_enqueue_ajax_pagination_script' );
add_action( 'enqueue_block_editor_assets', 'newsly_enqueue_ajax_pagination_script' );

/**
 * Enquque build/css/index.css file
 */
function newsly_enqueue_block_assets() {
	wp_enqueue_style(
		'newsly-plugin-style',
		plugins_url( 'dist/css/main.css', __FILE__ ),
		array(),
		NEWSLY_VERSION
	);
}
add_action( 'enqueue_block_assets', 'newsly_enqueue_block_assets' );

/**
 * Initialise the main plugin.
 *
 * @return Newsly
 */
function newsly() {
	return Newsly::init();
}
/**
 * Kick start the plugin.
 */
newsly();

/**
 * Create custom category of newsly block in gutenberg editor
 *
 * @param array $categories Existing block categories.
 * @return array Modified block categories.
 */
function newsly_register_layout_category_handler( $categories ) {
	$categories[] = array(
		'slug'  => 'newsly',
		'title' => 'Newsly',
	);
	return $categories;
}

if ( version_compare( get_bloginfo( 'version' ), '5.8', '>=' ) ) {
	add_filter( 'block_categories_all', 'newsly_register_layout_category_handler' );
} else {
	add_filter( 'block_categories', 'newsly_register_layout_category_handler' );
}
