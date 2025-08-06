<?php
/**
 * Class AdminOptionsTest
 *
 * @package Gutenberg_Starter
 */

/**
 * Test case for Admin Options functionality.
 */
class AdminOptionsTest extends WP_UnitTestCase {

	/**
	 * The Options instance.
	 *
	 * @var \Anam\GutenbergStarter\Admin\Options
	 */
	private $options;

	/**
	 * Set up test environment before each test.
	 */
	public function set_up() {
		parent::set_up();
		
		// Ensure we're in admin context.
		set_current_screen( 'dashboard' );
		
		// Set up admin context globals.
		global $pagenow;
		$pagenow = 'admin.php';
		
		// Initialize the Options class.
		$this->options = \Anam\GutenbergStarter\Admin\Options::init();
	}

	/**
	 * Clean up after each test.
	 */
	public function tear_down() {
		// Clean up any options that were set during testing.
		delete_option( 'gutenberg_starter_movie_api_key' );
		
		parent::tear_down();
	}

	/**
	 * Test that the Options class can be instantiated.
	 */
	public function test_options_class_instantiation() {
		$this->assertInstanceOf( 
			'\Anam\GutenbergStarter\Admin\Options', 
			$this->options 
		);
	}

	/**
	 * Test that the Options class is a singleton.
	 */
	public function test_options_singleton_pattern() {
		$options1 = \Anam\GutenbergStarter\Admin\Options::init();
		$options2 = \Anam\GutenbergStarter\Admin\Options::init();
		
		$this->assertSame( $options1, $options2 );
	}

	/**
	 * Test that admin hooks are registered in admin context.
	 */
	public function test_admin_hooks_registered() {
		// Test that admin_menu hook is registered.
		$this->assertTrue( 
			has_action( 'admin_menu', array( $this->options, 'gs_plugin_settings_page' ) ) !== false 
		);
		
		// Test that admin_init hook is registered.
		$this->assertTrue( 
			has_action( 'admin_init', array( $this->options, 'register_settings' ) ) !== false 
		);
	}

	/**
	 * Test settings registration.
	 */
	public function test_settings_registration() {
		// Trigger the register_settings method.
		$this->options->register_settings();
		
		// Get registered settings.
		$registered_settings = get_registered_settings();
		
		// Test that our setting is registered.
		$this->assertArrayHasKey( 'gutenberg_starter_movie_api_key', $registered_settings );
		
		// Test setting properties.
		$setting = $registered_settings['gutenberg_starter_movie_api_key'];
		$this->assertEquals( 'string', $setting['type'] );
		$this->assertEquals( 'sanitize_text_field', $setting['sanitize_callback'] );
		$this->assertFalse( $setting['show_in_rest'] );
		$this->assertEquals( '', $setting['default'] );
	}

	/**
	 * Test movie API key option default value.
	 */
	public function test_movie_api_key_default_value() {
		$api_key = get_option( 'gutenberg_starter_movie_api_key', '' );
		$this->assertEquals( '', $api_key );
	}

	/**
	 * Test movie API key option can be set and retrieved.
	 */
	public function test_movie_api_key_set_and_get() {
		$test_api_key = 'test_api_key_12345';
		
		// Set the option.
		update_option( 'gutenberg_starter_movie_api_key', $test_api_key );
		
		// Retrieve and test.
		$retrieved_key = get_option( 'gutenberg_starter_movie_api_key' );
		$this->assertEquals( $test_api_key, $retrieved_key );
	}

	/**
	 * Test movie API key sanitization.
	 */
	public function test_movie_api_key_sanitization() {
		$dirty_api_key = '<script>alert("xss")</script>api_key_123';
		$expected_clean_key = 'api_key_123'; // sanitize_text_field removes script tags completely
		
		// Test sanitization through sanitize_text_field.
		$sanitized_key = sanitize_text_field( $dirty_api_key );
		$this->assertEquals( $expected_clean_key, $sanitized_key );
		
		// Test through option update.
		update_option( 'gutenberg_starter_movie_api_key', $dirty_api_key );
		$retrieved_key = get_option( 'gutenberg_starter_movie_api_key' );
		
		// Note: WordPress automatically applies sanitization based on registered setting.
		$this->assertNotEquals( $dirty_api_key, $retrieved_key );
		$this->assertStringNotContainsString( '<script>', $retrieved_key );
		$this->assertStringNotContainsString( '</script>', $retrieved_key );
	}

	/**
	 * Test admin page registration.
	 */
	public function test_admin_page_registration() {
		global $submenu;
		
		// Clear any existing submenu.
		$submenu = array();
		
		// Trigger the settings page registration.
		$this->options->gs_plugin_settings_page();
		
		// Check if the page was added to options submenu.
		$this->assertArrayHasKey( 'options-general.php', $submenu );
		
		// Find our specific page in the submenu.
		$found_page = false;
		foreach ( $submenu['options-general.php'] as $page ) {
			if ( $page[2] === 'gutenberg_starter' ) {
				$found_page = true;
				$this->assertEquals( 'Gutenberg Starter', $page[0] ); // Page title in menu.
				$this->assertEquals( 'manage_options', $page[1] ); // Required capability.
				break;
			}
		}
		
		$this->assertTrue( $found_page, 'Gutenberg Starter settings page not found in admin menu' );
	}

	/**
	 * Test settings page callback output.
	 */
	public function test_settings_page_callback_output() {
		// Set a test API key.
		$test_api_key = 'test_api_key_output';
		update_option( 'gutenberg_starter_movie_api_key', $test_api_key );
		
		// Capture output.
		ob_start();
		$this->options->gs_handle_plugin_setting_page_callback();
		$output = ob_get_clean();
		
		// Test that output contains expected elements.
		$this->assertStringContainsString( '<div class="wrap">', $output );
		$this->assertStringContainsString( '<form method="post" action="options.php">', $output );
		$this->assertStringContainsString( 'gutenberg_starter_movie_api_key', $output );
		$this->assertStringContainsString( $test_api_key, $output );
		$this->assertStringContainsString( 'Movie Lists Block Settings', $output );
		$this->assertStringContainsString( 'The Movie Database API Key', $output );
		$this->assertStringContainsString( 'submit', $output );
	}

	/**
	 * Test settings page callback with empty API key.
	 */
	public function test_settings_page_callback_empty_api_key() {
		// Ensure no API key is set.
		delete_option( 'gutenberg_starter_movie_api_key' );
		
		// Capture output.
		ob_start();
		$this->options->gs_handle_plugin_setting_page_callback();
		$output = ob_get_clean();
		
		// Test that output contains empty value.
		$this->assertStringContainsString( 'value=""', $output );
	}

	/**
	 * Test settings page callback with special characters in API key.
	 */
	public function test_settings_page_callback_special_characters() {
		// Set API key with special characters.
		$special_api_key = 'api&key<with>special"chars\'';
		update_option( 'gutenberg_starter_movie_api_key', $special_api_key );
		
		// Capture output.
		ob_start();
		$this->options->gs_handle_plugin_setting_page_callback();
		$output = ob_get_clean();
		
		// Test that special characters are properly escaped.
		$this->assertStringContainsString( 'api&amp;key&lt;with&gt;special&quot;chars&#039;', $output );
		$this->assertStringNotContainsString( 'api&key<with>special"chars\'', $output );
	}

	/**
	 * Test that settings fields are properly generated.
	 */
	public function test_settings_fields_generation() {
		// Mock the settings fields function.
		$this->options->register_settings();
		
		// Capture settings fields output.
		ob_start();
		settings_fields( 'gutenberg_starter_settings' );
		$output = ob_get_clean();
		
		// Test that nonce and other hidden fields are present.
		$this->assertStringContainsString( 'option_page', $output );
		$this->assertStringContainsString( 'gutenberg_starter_settings', $output );
		$this->assertStringContainsString( '_wpnonce', $output );
	}

	/**
	 * Test capability requirement for settings page access.
	 */
	public function test_settings_page_capability_requirement() {
		// Create a user without manage_options capability.
		$user_id = $this->factory->user->create( array( 'role' => 'subscriber' ) );
		wp_set_current_user( $user_id );
		
		// Test that current user cannot manage options.
		$this->assertFalse( current_user_can( 'manage_options' ) );
		
		// Reset to admin user.
		wp_set_current_user( 1 );
		$this->assertTrue( current_user_can( 'manage_options' ) );
	}

	/**
	 * Test multiple settings can be registered (for future extensibility).
	 */
	public function test_multiple_settings_registration() {
		// Register the default settings.
		$this->options->register_settings();
		
		// Manually register an additional test setting.
		register_setting(
			'gutenberg_starter_settings',
			'gutenberg_starter_test_setting',
			array(
				'type' => 'string',
				'default' => 'test_default',
			)
		);
		
		// Test both settings are registered.
		$registered_settings = get_registered_settings();
		$this->assertArrayHasKey( 'gutenberg_starter_movie_api_key', $registered_settings );
		$this->assertArrayHasKey( 'gutenberg_starter_test_setting', $registered_settings );
	}
}
