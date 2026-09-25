<?php
/**
 * Tests for the Post Lists Tab AJAX handler.
 *
 * @package Anam\Newsly
 */

/**
 * Covers Anam\Newsly\Blocks\Inc\Class_Post_List_Tab_Callback::newsly_handle_category_post_content().
 */
class Post_Lists_Tab_Ajax_Test extends WP_Ajax_UnitTestCase {

	/**
	 * Create a post whose content contains a real post-lists-tab block, so
	 * get_block_attributes_from_post() finds attributes instead of a WP_Error.
	 *
	 * @param array $attrs Block attributes to encode into the block comment.
	 * @return int Post ID.
	 */
	private function create_post_with_block( $attrs = array() ) {
		$defaults = array(
			'showExcerpt'       => false,
			'showCategory'      => false,
			'showFeaturedImage' => false,
		);
		$attrs    = wp_parse_args( $attrs, $defaults );
		$content  = '<!-- wp:newsly-block/post-lists-tab ' . wp_json_encode( $attrs ) . ' /-->';

		return self::factory()->post->create( array( 'post_content' => $content ) );
	}

	/**
	 * A missing nonce is rejected with a JSON error, not a fatal error.
	 */
	public function test_rejects_missing_nonce() {
		$_POST['postId']  = $this->create_post_with_block();
		$_POST['catSlug'] = '';

		try {
			$this->_handleAjax( 'handle_category_post_content' );
			$this->fail( 'Expected the handler to call wp_die().' );
		} catch ( WPAjaxDieContinueException $e ) {
			unset( $e );
		}

		$response = json_decode( $this->_last_response, true );
		$this->assertFalse( $response['success'] );
		$this->assertSame( 'Invalid nonce', $response['data']['message'] );
	}

	/**
	 * An invalid nonce is rejected the same way as a missing one.
	 */
	public function test_rejects_invalid_nonce() {
		$_POST['postId']          = $this->create_post_with_block();
		$_POST['catSlug']         = '';
		$_POST['newslyAjaxNonce'] = 'not-a-real-nonce';

		try {
			$this->_handleAjax( 'handle_category_post_content' );
			$this->fail( 'Expected the handler to call wp_die().' );
		} catch ( WPAjaxDieContinueException $e ) {
			unset( $e );
		}

		$response = json_decode( $this->_last_response, true );
		$this->assertFalse( $response['success'] );
		$this->assertSame( 'Invalid nonce', $response['data']['message'] );
	}

	/**
	 * At most 9 posts come back, even when the category holds more.
	 */
	public function test_limits_results_to_nine_posts() {
		$category = self::factory()->category->create( array( 'slug' => 'news' ) );
		$post_ids = self::factory()->post->create_many( 12, array( 'post_category' => array( $category ) ) );

		$_POST['postId']          = $this->create_post_with_block();
		$_POST['catSlug']         = 'news';
		$_POST['newslyAjaxNonce'] = wp_create_nonce( 'newsly_ajax_nonce' );

		try {
			$this->_handleAjax( 'handle_category_post_content' );
			$this->fail( 'Expected the handler to call wp_die().' );
		} catch ( WPAjaxDieContinueException $e ) {
			unset( $e );
		}

		$this->assertSame( 9, substr_count( $this->_last_response, 'post-card shadow-md' ) );
		unset( $post_ids );
	}

	/**
	 * Post titles are escaped in the AJAX response.
	 */
	public function test_escapes_post_title() {
		// Post titles go through title_save_pre's kses filtering for authors
		// without unfiltered_html, so an admin creates this one - otherwise
		// the <script> tag would never reach the DB, and the test would prove
		// nothing about the handler's own esc_html() call.
		$admin_id = self::factory()->user->create( array( 'role' => 'administrator' ) );
		wp_set_current_user( $admin_id );

		$category = self::factory()->category->create( array( 'slug' => 'news' ) );
		self::factory()->post->create(
			array(
				'post_title'    => '<script>alert(1)</script>',
				'post_category' => array( $category ),
			)
		);

		wp_set_current_user( 0 );

		$_POST['postId']          = $this->create_post_with_block();
		$_POST['catSlug']         = 'news';
		$_POST['newslyAjaxNonce'] = wp_create_nonce( 'newsly_ajax_nonce' );

		try {
			$this->_handleAjax( 'handle_category_post_content' );
			$this->fail( 'Expected the handler to call wp_die().' );
		} catch ( WPAjaxDieContinueException $e ) {
			unset( $e );
		}

		$this->assertStringNotContainsString( '<script>alert(1)</script>', $this->_last_response );
		$this->assertStringContainsString( '&lt;script&gt;', $this->_last_response );
	}
}
