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
 * Text Domain: 'gutenbergp-starter'
 */
// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Autoload vendor folder
 */
require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;


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
	 * Add installation time
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
 * Manage fonts in the editor
 * 
 * ref: https://developer.wordpress.org/block-editor/how-to-guides/enqueueing-assets-in-the-editor/
 *
 * @return void
 */
function handle_google_fonts() {
	wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap', array(), null );
}
add_action( 'enqueue_block_editor_assets', 'handle_google_fonts' );
add_action( 'wp_enqueue_scripts', 'handle_google_fonts' );

function gs_enqueue_editor_assets() {
	wp_enqueue_script(
		'gs-block-monitor',
		plugins_url( 'dist/js/main.js', __FILE__ ),
		[ 'wp-plugins', 'wp-edit-post', 'wp-data', 'wp-element' ],
		'1.0',
		true
	);

    // Ensure the script is treated as an ES module
	add_filter( 'script_loader_tag', function ( $tag, $handle ) {
		if ( 'gs-block-monitor' === $handle ) {
			return str_replace( 'src=', 'type="module" src=', $tag );
		}
		return $tag;
	}, 10, 2 );
}
// add_action('enqueue_block_editor_assets', 'gs_enqueue_editor_assets');

/**
 * Enqueue script for ajax pagination
 */
function gs_enqueue_ajax_pagination_script() {
	wp_enqueue_script( 'jquery' );
	wp_localize_script(
		'jquery',
		'anamajaxpagination',
		array(
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
			'gs_ajax_nonce'   => wp_create_nonce( 'gs_ajax_nonce' )
		)
	);
}
add_action( 'wp_enqueue_scripts', 'gs_enqueue_ajax_pagination_script' );

/**
 * Enquque build/css/index.css file
 */
function gs_enqueue_block_assets() {
	wp_enqueue_style(
		'gs-plugin-style',
		plugins_url( 'dist/css/main.css', __FILE__ ),
		array(),
		'1.0'
	);
}
add_action( 'enqueue_block_assets', 'gs_enqueue_block_assets' );

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

/**
 * Create custom category of CGL block in gutenberg editor
 *
 * @param [type] $categories Custom category name.
 * @return Array
 */
function prefix_register_layout_category_handler( $categories ) {
	$categories[] = array(
		'slug'  => 'anam-starter',
		'title' => 'Anam Starter',
	);
	return $categories;
}

if ( version_compare( get_bloginfo( 'version' ), '5.8', '>=' ) ) {
	add_filter( 'block_categories_all', 'prefix_register_layout_category_handler' );
} else {
	add_filter( 'block_categories', 'prefix_register_layout_category_handler' );
}
