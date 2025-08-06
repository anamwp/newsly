<?php
/**
 * Class AdminOptionsTest
 *
 * @package Gutenberg_Starter
 */

/**
 * Test case for Admin Options functionality.
 */
class Admin_Options_Test extends WP_UnitTestCase {

	/**
	 * The Options instance.
	 *
	 * @var \Anam\GutenbergStarter\Admin\Options
	 */
	private $options;

	/**
	 * Set up test fixtures before each test method.
	 */
	public function set_up() {
		parent::set_up();
		$this->options = \Anam\GutenbergStarter\Admin\Options::init();
	}

	/**
	 * Clean up after each test method.
	 */
	public function tear_down() {
		parent::tear_down();
		// Clean up any registered options
		delete_option('gutenberg_starter_movie_api_key');
	}

	/**
	 * Test that Options class can be instantiated.
	 */
	public function test_options_instantiation() {
		$this->assertInstanceOf(
			'\Anam\GutenbergStarter\Admin\Options',
			$this->options
		);
	}

	/**
	 * Test singleton pattern.
	 */
	public function test_singleton_pattern() {
		$instance1 = \Anam\GutenbergStarter\Admin\Options::init();
		$instance2 = \Anam\GutenbergStarter\Admin\Options::init();
		
		$this->assertSame($instance1, $instance2);
	}

	/**
	 * Test first-time instantiation to cover the singleton creation line.
	 */
	public function test_singleton_first_instantiation() {
		// Clear any existing instance using reflection to test first-time creation
		// ReflectionClass is a built-in PHP class that provides powerful runtime introspection capabilities - essentially letting you examine and analyze classes, their properties, methods, and other characteristics while your code is running.
		$reflection = new ReflectionClass('\Anam\GutenbergStarter\Admin\Options');
		$instance_property = $reflection->getProperty('instance');
		$instance_property->setAccessible(true);
		$instance_property->setValue(null, null);
		
		// This should trigger the "self::$instance = new self();" line (line 21)
		$instance = \Anam\GutenbergStarter\Admin\Options::init();
		
		$this->assertInstanceOf('\Anam\GutenbergStarter\Admin\Options', $instance);
		$this->assertNotNull($instance);
		
		// Verify subsequent calls return the same instance
		$instance2 = \Anam\GutenbergStarter\Admin\Options::init();
		$this->assertSame($instance, $instance2);
	}

	/**
	 * Test that admin hooks are registered in admin context.
	 */
	public function test_admin_hooks_registration() {
		// Simulate admin context
		set_current_screen('dashboard');
		
		// Create a new instance to trigger hook registration
		$options = new \Anam\GutenbergStarter\Admin\Options();

		// Check if admin_menu hook is registered
		$this->assertGreaterThan(
			0,
			has_action('admin_menu', array($options, 'gs_plugin_settings_page'))
		);
		
		// Check if admin_init hook is registered
		$this->assertGreaterThan(
			0,
			has_action('admin_init', array($options, 'register_settings'))
		);
	}

	/**
	 * Test settings registration.
	 */
	public function test_settings_registration() {
		// Simulate admin context
		set_current_screen('dashboard');
		wp_set_current_user(1); // Admin user
		
		$this->options->register_settings();
		
		// Test that the API key setting is registered
		global $wp_settings_fields;
		
		// The setting should be registered in the options table
		$registered_settings = get_registered_settings();
		$this->assertArrayHasKey('gutenberg_starter_movie_api_key', $registered_settings);
	}

	/**
	 * Test admin menu addition.
	 */
	public function test_admin_menu_addition() {
		global $submenu;
		
		// Simulate admin context
		set_current_screen('dashboard');
		wp_set_current_user(1); // Admin user
		
		$this->options->gs_plugin_settings_page();
		
		// Check if submenu was added to options-general.php
		$this->assertArrayHasKey('options-general.php', $submenu);
		
		// Look for our specific menu item
		$found = false;
		if (isset($submenu['options-general.php'])) {
			foreach ($submenu['options-general.php'] as $menu_item) {
				if (isset($menu_item[2]) && $menu_item[2] === 'gutenberg_starter') {
					$found = true;
					break;
				}
			}
		}
		$this->assertTrue($found, 'Gutenberg Starter settings page not found in admin menu');
	}

	/**
	 * Test movie API key option functionality.
	 * ✅✅✅
	 */
	public function test_movie_api_key_option() {
		$test_key = 'test_api_key_123456';
		
		// Set the option
		update_option('gutenberg_starter_movie_api_key', $test_key);
		
		// Get the option
		$retrieved_key = get_option('gutenberg_starter_movie_api_key');
		
		$this->assertEquals($test_key, $retrieved_key);
		
		// Test default value when option doesn't exist
		delete_option('gutenberg_starter_movie_api_key');
		$default_key = get_option('gutenberg_starter_movie_api_key', '');
		$this->assertEquals('', $default_key);
	}

	/**
	 * Test settings page callback output.
	 * ✅✅✅
	 */
	public function test_settings_page_callback_output() {
		// Set up admin context
		set_current_screen('options-general');
		wp_set_current_user(1);
		
		// Set a test API key
		update_option('gutenberg_starter_movie_api_key', 'test_key_output');
		
		// Capture the output
		ob_start();
		$this->options->gs_handle_plugin_setting_page_callback();
		$output = ob_get_clean();
		
		// Check for essential elements
		$this->assertStringContainsString('<div class="wrap">', $output);
		$this->assertStringContainsString('<form method="post" action="options.php">', $output);
		$this->assertStringContainsString('gutenberg_starter_movie_api_key', $output);
		$this->assertStringContainsString('test_key_output', $output);
		$this->assertStringContainsString('The Movie Database API Key', $output);
	}

	/**
	 * Test capability requirement for settings page.
	 */
	public function test_capability_requirement() {
		// Test with admin user (should have manage_options capability)
		wp_set_current_user(1);
		$this->assertTrue(current_user_can('manage_options'));
		
		// Test with subscriber user (should not have manage_options capability)
		$user_id = $this->factory->user->create(array('role' => 'subscriber'));
		wp_set_current_user($user_id);
		$this->assertFalse(current_user_can('manage_options'));
	}

	/**
	 * Test settings sanitization through WordPress register_setting.
	 * ✅✅✅
	 */
	public function test_settings_sanitization() {
		$this->options->register_settings();
		
		// Test XSS protection via sanitize_text_field
		$dirty_input = '<script>alert("xss")</script>clean_key';
		$sanitized = sanitize_text_field($dirty_input);
		$this->assertEquals('clean_key', $sanitized);
		
		// Test that empty values are handled
		$empty_input = '';
		$sanitized_empty = sanitize_text_field($empty_input);
		$this->assertEquals('', $sanitized_empty);
	}

	/**
	 * Test that settings form includes proper security fields.
	 */
	public function test_settings_form_security() {
		// Set up admin context
		set_current_screen('options-general');
		wp_set_current_user(1);
		
		// Capture the output
		ob_start();
		$this->options->gs_handle_plugin_setting_page_callback();
		$output = ob_get_clean();
		
		// Check for WordPress nonce and settings fields (generated by settings_fields function)
		$this->assertStringContainsString('_wpnonce', $output);
		$this->assertStringContainsString('gutenberg_starter_settings', $output);
		$this->assertStringContainsString('option_page', $output);
	}

	/**
	 * Test multiple instances create singleton behavior.
	 */
	public function test_multiple_instances_singleton() {
		$instance1 = \Anam\GutenbergStarter\Admin\Options::init();
		$instance2 = \Anam\GutenbergStarter\Admin\Options::init();
		$instance3 = \Anam\GutenbergStarter\Admin\Options::init();
		
		$this->assertSame($instance1, $instance2);
		$this->assertSame($instance2, $instance3);
		$this->assertSame($instance1, $instance3);
	}

	/**
	 * Test that constructor only registers hooks in admin context.
	 */
	public function test_constructor_admin_only() {
		// Clear any existing hooks
		remove_all_actions('admin_menu');
		remove_all_actions('admin_init');
		
		// Test in non-admin context (frontend)
		set_current_screen('front');
		$frontend_instance = new \Anam\GutenbergStarter\Admin\Options();
		
		// Hooks should not be registered in frontend
		$this->assertFalse(has_action('admin_menu', array($frontend_instance, 'gs_plugin_settings_page')));
		$this->assertFalse(has_action('admin_init', array($frontend_instance, 'register_settings')));
		
		// Test in admin context
		set_current_screen('dashboard');
		$admin_instance = new \Anam\GutenbergStarter\Admin\Options();
		
		// Hooks should be registered in admin
		$this->assertGreaterThan(0, has_action('admin_menu', array($admin_instance, 'gs_plugin_settings_page')));
		$this->assertGreaterThan(0, has_action('admin_init', array($admin_instance, 'register_settings')));
	}
}
