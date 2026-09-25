<?php
/**
 * Tests for Anam\Newsly\Blocks\Block.
 *
 * @package Anam\Newsly
 */

use Anam\Newsly\Blocks\Block;

/**
 * Covers block registration and the missing-build admin notice.
 */
class Block_Registration_Test extends WP_UnitTestCase {

	/**
	 * Block names the plugin registers, keyed the same as Block::$block_names.
	 *
	 * @var string[]
	 */
	const BLOCK_NAMES = array(
		'newsly-block/category-post',
		'newsly-block/featured-posts',
		'newsly-block/latest-posts',
		'newsly-block/post-lists-tab',
	);

	/**
	 * Unregister the plugin's blocks so each test starts from a clean registry,
	 * regardless of whether the real build/ was present when the suite booted.
	 */
	public function set_up() {
		parent::set_up();
		$this->unregister_newsly_blocks();
	}

	/**
	 * Leave the registry as this test found it.
	 */
	public function tear_down() {
		$this->unregister_newsly_blocks();
		parent::tear_down();
	}

	/**
	 * Remove all of the plugin's block types from the registry, if present.
	 */
	private function unregister_newsly_blocks() {
		$registry = WP_Block_Type_Registry::get_instance();
		foreach ( self::BLOCK_NAMES as $name ) {
			if ( $registry->is_registered( $name ) ) {
				$registry->unregister( $name );
			}
		}
	}

	/**
	 * Points newsly_build_path at the fixture blocks directory.
	 *
	 * @return string
	 */
	public function fixture_build_path() {
		return __DIR__ . '/fixtures/build';
	}

	/**
	 * Points newsly_build_path at a directory that doesn't exist.
	 *
	 * @return string
	 */
	public function missing_build_path() {
		return __DIR__ . '/fixtures/no-such-build';
	}

	/**
	 * All four block types register when build/ (here, the fixture) exists.
	 */
	public function test_all_block_types_register_from_build_path() {
		add_filter( 'newsly_build_path', array( $this, 'fixture_build_path' ) );
		Block::init()->register_block();

		$registry = WP_Block_Type_Registry::get_instance();
		foreach ( self::BLOCK_NAMES as $name ) {
			$this->assertTrue( $registry->is_registered( $name ), "$name should be registered." );
		}
	}

	/**
	 * No blocks register when the build path doesn't exist.
	 */
	public function test_no_blocks_register_when_build_path_missing() {
		add_filter( 'newsly_build_path', array( $this, 'missing_build_path' ) );
		Block::init()->register_block();

		$registry = WP_Block_Type_Registry::get_instance();
		foreach ( self::BLOCK_NAMES as $name ) {
			$this->assertFalse( $registry->is_registered( $name ), "$name should not be registered." );
		}
	}

	/**
	 * The missing-build admin notice is hooked when the build path is missing
	 * and the current screen is wp-admin.
	 */
	public function test_missing_build_notice_hooked_for_admin_screen() {
		set_current_screen( 'dashboard' );
		$this->assertTrue( is_admin() );

		add_filter( 'newsly_build_path', array( $this, 'missing_build_path' ) );
		Block::init()->register_block();

		$this->assertNotFalse( has_action( 'admin_notices', array( Block::init(), 'missing_build_notice' ) ) );
	}

	/**
	 * The missing-build admin notice is NOT hooked outside wp-admin, even
	 * when the build path is missing.
	 */
	public function test_missing_build_notice_not_hooked_on_front_end() {
		set_current_screen( 'front' );
		$this->assertFalse( is_admin() );

		add_filter( 'newsly_build_path', array( $this, 'missing_build_path' ) );
		Block::init()->register_block();

		$this->assertFalse( has_action( 'admin_notices', array( Block::init(), 'missing_build_notice' ) ) );
	}
}
