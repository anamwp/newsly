<?php
/**
 * Class OptionsSettingsTest
 *
 * @package Gutenberg_Starter
 */

/**
 * Test case for Options Settings functionality.
 * Tests the WordPress Settings API integration.
 */
class Options_Settings_Test extends WP_UnitTestCase {

	/**
	 * Set up test environment before each test.
	 */
	public function set_up() {
		parent::set_up();

		// Clean up any existing options.
		delete_option( 'gutenberg_starter_movie_api_key' );

		// Ensure we're in admin context.
		if ( ! is_admin() ) {
			set_current_screen( 'dashboard' );
		}
	}

	/**
	 * Clean up after each test.
	 */
	public function tear_down() {
		// Clean up any options that were set during testing.
		delete_option( 'gutenberg_starter_movie_api_key' );
		// Call parent tear_down to ensure proper cleanup.
		parent::tear_down();
	}

	/**
	 * Test that the movie API key option can be saved and retrieved.
	 */
	public function test_save_and_retrieve_movie_api_key() {
		$test_api_key = 'test_movie_api_key_123456789';

		// Simulate saving the option.
		$result = update_option( 'gutenberg_starter_movie_api_key', $test_api_key );

		// Test that the save was successful.
		$this->assertTrue( $result );

		// Test that we can retrieve the saved value.
		$retrieved_value = get_option( 'gutenberg_starter_movie_api_key' );
		$this->assertEquals( $test_api_key, $retrieved_value );
	}

	/**
	 * Test that empty API key returns default value.
	 */
	public function test_empty_api_key_default_value() {
		// Ensure option doesn't exist.
		delete_option( 'gutenberg_starter_movie_api_key' );

		// Test with default value.
		$value = get_option( 'gutenberg_starter_movie_api_key', 'default_value' );
		$this->assertEquals( 'default_value', $value );

		// Test without default value.
		$value = get_option( 'gutenberg_starter_movie_api_key' );
		$this->assertFalse( $value );
	}

	/**
	 * Test API key validation and sanitization.
	 */
	public function test_api_key_sanitization() {
		// Test with malicious input.
		$malicious_input = '<script>alert("xss")</script>api_key_123';
		$sanitized_value = sanitize_text_field( $malicious_input );

		// Should remove script tags but keep the api key part.
		$this->assertStringNotContainsString( '<script>', $sanitized_value );
		$this->assertStringNotContainsString( '</script>', $sanitized_value );
		$this->assertStringContainsString( 'api_key_123', $sanitized_value );
	}

	/**
	 * Test API key with special characters.
	 */
	public function test_api_key_special_characters() {
		$api_key_with_special_chars = 'api-key_123.test@domain';

		update_option( 'gutenberg_starter_movie_api_key', $api_key_with_special_chars );
		$retrieved_value = get_option( 'gutenberg_starter_movie_api_key' );

		$this->assertEquals( $api_key_with_special_chars, $retrieved_value );
	}

	/**
	 * Test API key maximum length handling.
	 */
	public function test_api_key_length_handling() {
		// Test with very long API key.
		$long_api_key = str_repeat( 'a', 1000 );

		update_option( 'gutenberg_starter_movie_api_key', $long_api_key );
		$retrieved_value = get_option( 'gutenberg_starter_movie_api_key' );

		$this->assertEquals( $long_api_key, $retrieved_value );
		$this->assertEquals( 1000, strlen( $retrieved_value ) );
	}

	/**
	 * Test API key with null and false values.
	 */
	public function test_api_key_null_false_values() {
		// Test with null value.
		update_option( 'gutenberg_starter_movie_api_key', null );
		$retrieved_value = get_option( 'gutenberg_starter_movie_api_key' );
		$this->assertEquals( '', $retrieved_value );

		// Test with false value.
		update_option( 'gutenberg_starter_movie_api_key', false );
		$retrieved_value = get_option( 'gutenberg_starter_movie_api_key' );
		$this->assertEquals( '', $retrieved_value );
	}

	/**
	 * Test API key with numeric values.
	 */
	public function test_api_key_numeric_values() {
		$numeric_api_key = 123456789;

		update_option( 'gutenberg_starter_movie_api_key', $numeric_api_key );
		$retrieved_value = get_option( 'gutenberg_starter_movie_api_key' );

		// WordPress may store numeric values as integers or strings depending on context.
		$this->assertEquals( $numeric_api_key, $retrieved_value );
		$this->assertTrue( is_numeric( $retrieved_value ) );
	}

	/**
	 * Test option deletion.
	 */
	public function test_api_key_deletion() {
		$test_api_key = 'test_api_key_to_delete';

		// Set the option.
		update_option( 'gutenberg_starter_movie_api_key', $test_api_key );
		$this->assertEquals( $test_api_key, get_option( 'gutenberg_starter_movie_api_key' ) );

		// Delete the option.
		$result = delete_option( 'gutenberg_starter_movie_api_key' );
		$this->assertTrue( $result );

		// Verify it's deleted.
		$this->assertFalse( get_option( 'gutenberg_starter_movie_api_key' ) );
	}

	/**
	 * Test option update vs add behavior.
	 */
	public function test_option_update_vs_add() {
		$api_key1 = 'first_api_key';
		$api_key2 = 'second_api_key';

		// First update (should add).
		$result1 = update_option( 'gutenberg_starter_movie_api_key', $api_key1 );
		$this->assertTrue( $result1 );
		$this->assertEquals( $api_key1, get_option( 'gutenberg_starter_movie_api_key' ) );

		// Second update (should update existing).
		$result2 = update_option( 'gutenberg_starter_movie_api_key', $api_key2 );
		$this->assertTrue( $result2 );
		$this->assertEquals( $api_key2, get_option( 'gutenberg_starter_movie_api_key' ) );
	}

	/**
	 * Test option with autoload parameter.
	 */
	public function test_option_autoload() {
		$test_api_key = 'autoload_test_api_key';

		// Add option with autoload = false.
		add_option( 'gutenberg_starter_movie_api_key', $test_api_key, '', 'no' );

		// Verify the option exists and has correct value.
		$this->assertEquals( $test_api_key, get_option( 'gutenberg_starter_movie_api_key' ) );

		// Clean up.
		delete_option( 'gutenberg_starter_movie_api_key' );
	}

	/**
	 * Test multiple options don't interfere with each other.
	 */
	public function test_multiple_options_isolation() {
		$movie_api_key      = 'movie_api_key_123';
		$other_option_value = 'other_value_456';

		// Set both options.
		update_option( 'gutenberg_starter_movie_api_key', $movie_api_key );
		update_option( 'gutenberg_starter_other_option', $other_option_value );

		// Verify both exist and have correct values.
		$this->assertEquals( $movie_api_key, get_option( 'gutenberg_starter_movie_api_key' ) );
		$this->assertEquals( $other_option_value, get_option( 'gutenberg_starter_other_option' ) );

		// Delete one and verify the other remains.
		delete_option( 'gutenberg_starter_movie_api_key' );
		$this->assertFalse( get_option( 'gutenberg_starter_movie_api_key' ) );
		$this->assertEquals( $other_option_value, get_option( 'gutenberg_starter_other_option' ) );

		// Clean up.
		delete_option( 'gutenberg_starter_other_option' );
	}

	/**
	 * Test option with WordPress filters.
	 */
	public function test_option_with_filters() {
		$original_value = 'original_api_key';
		$filtered_value = 'filtered_api_key';

		// Add a filter to modify the option value.
		add_filter(
			'option_gutenberg_starter_movie_api_key',
			function ( $value ) use ( $filtered_value ) {
				return $filtered_value;
			}
		);

		// Set the option.
		update_option( 'gutenberg_starter_movie_api_key', $original_value );

		// Get the option (should be filtered).
		$retrieved_value = get_option( 'gutenberg_starter_movie_api_key' );
		$this->assertEquals( $filtered_value, $retrieved_value );

		// Remove the filter.
		remove_all_filters( 'option_gutenberg_starter_movie_api_key' );

		// Get the option again (should be original value).
		$retrieved_value = get_option( 'gutenberg_starter_movie_api_key' );
		$this->assertEquals( $original_value, $retrieved_value );
	}
}
