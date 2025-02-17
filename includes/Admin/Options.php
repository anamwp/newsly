<?php

namespace Anam\GutenbergStarter\Admin;

/**
 * Plugin Option Panel.
 *
 * @since Version 3 digits
 */
class Options {
	/**
	 * self instance
	 * of this shortcode
	 *
	 * @var [type]
	 */
	private static $instance;
	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * Construct of Class
	 */
	public function __construct() {
		if ( is_admin() ) {
			add_action( 'admin_menu', array( $this, 'gs_plugin_settings_page' ) );
		}
	}
	public function gs_plugin_settings_page() {
		add_options_page( 'Gutenberg Starter', 'Gutenberg Starter', 'manage_options', 'guternberg_starter', array( $this, 'gs_handle_plugin_setting_page_callback' ), null );
	}
	public function gs_handle_plugin_setting_page_callback() {
		?>
		<h1>Guternberg Starter</h1>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam quam dicta consequatur labore, libero veniam suscipit obcaecati eligendi architecto veritatis, illum tempore harum quos assumenda ab, ut in consectetur aspernatur dolor at vel! Magni, accusamus?</p>
		<?php
	}
}

