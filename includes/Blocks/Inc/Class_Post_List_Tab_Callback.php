<?php
/**
 * Summary.
 *
 * Description.
 *
 * @since Version 3 digits
 * @package Newsly
 */

	namespace Anam\Newsly\Blocks\Inc;

/**
 * Summary.
 *
 * @since Version 3 digits
 */
class Class_Post_List_Tab_Callback {

	/**
	 * Undocumented variable
	 *
	 * @var [type]
	 */
	private static $instance;
	/**
	 * Undocumented variable
	 *
	 * @var string
	 */
	private static $block_name = 'newsly-block/post-lists-tab';

	/**
	 * Undocumented function
	 *
	 * @return Instance
	 */
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
		add_action( 'wp_ajax_nopriv_handle_category_post_content', array( $this, 'newsly_handle_category_post_content' ) );
		add_action( 'wp_ajax_handle_category_post_content', array( $this, 'newsly_handle_category_post_content' ) );
	}
	/**
	 * Get block attributes from post
	 *
	 * @param [int]    $post_id - Post ID.
	 * @param [string] $block_name - Block name.
	 * @return Array| WP_Error
	 */
	public function get_block_attributes_from_post( $post_id, $block_name ) {
		// Get the post content.
		$post = get_post( $post_id );
		if ( ! $post ) {
			return new \WP_Error( 'invalid_post', 'Post not found' );
		}
		// Parse the content into blocks.
		$blocks = parse_blocks( $post->post_content );
		// Find the desired block.
		foreach ( $blocks as $block ) {
			if ( $block['blockName'] === $block_name ) {
				return isset( $block['attrs'] ) ? $block['attrs'] : array();
			}
		}
		return new \WP_Error( 'block_not_found', 'Block not found in post' );
	}
	/**
	 * Ajax callback to get posts by category.
	 *
	 * @return void
	 */
	public function newsly_handle_category_post_content() {
		/**
		 * Verify nonce for security.
		 */
		$newsly_ajax_nonce = isset( $_POST['newslyAjaxNonce'] ) ? sanitize_text_field( wp_unslash( $_POST['newslyAjaxNonce'] ) ) : '';
		if ( empty( $newsly_ajax_nonce ) || ! wp_verify_nonce( $newsly_ajax_nonce, 'newsly_ajax_nonce' ) ) {
			wp_send_json_error( array( 'message' => 'Invalid nonce' ) );
			die();
		}
		/**
		 * Check and sanitize inputs.
		 */
		$cat_slug = isset( $_POST['catSlug'] ) ? sanitize_text_field( wp_unslash( $_POST['catSlug'] ) ) : '';
		$post_id  = isset( $_POST['postId'] ) ? sanitize_text_field( wp_unslash( $_POST['postId'] ) ) : '';
		// Make post int.
		$post_id             = intval( $post_id );
		$block_attr          = $this->get_block_attributes_from_post( $post_id, self::$block_name );
		$show_excerpt        = isset( $block_attr['showExcerpt'] ) ? $block_attr['showExcerpt'] : true;
		$show_category       = isset( $block_attr['showCategory'] ) ? $block_attr['showCategory'] : true;
		$show_featured_image = isset( $block_attr['showFeaturedImage'] ) ? $block_attr['showFeaturedImage'] : true;

		/**
		 * Query to get posts by category.
		 */
		$args  = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'category_name'  => $cat_slug,
			'posts_per_page' => 9,
		);
		$posts = new \WP_Query( $args );
		?>
		<?php if ( $posts->have_posts() ) : ?>
			<?php
			while ( $posts->have_posts() ) :
				$posts->the_post();
				$post_id = get_the_ID();
				$post    = array(
					'id'      => $post_id,
					'title'   => get_the_title( $post_id ),
					'excerpt' => get_the_excerpt( $post_id ),
				);
				?>
				<div class="post-card shadow-md hover:shadow-lg rounded border-solid border-x border-y p-8">
					<?php if ( $show_featured_image ) : ?>
					<div class="thumbnail card__img rounded">
						<?php if ( has_post_thumbnail( $post_id ) ) : ?>
							<?php
								echo get_the_post_thumbnail( $post_id, 'large', array( 'class' => 'post-thumbnail rounded h-80 object-cover w-full' ) );
							?>
						<?php else : ?>
							<img class="rounded h-80 object-cover w-full" src="<?php echo esc_url( plugins_url( 'assets/images/placeholder.svg', NEWSLY_FILE ) ); ?>" alt="Placeholder Image">
						<?php endif; ?>
					</div>
					<?php endif; ?>
					<a class="post-card__title mt-4 inline-block font-poppins text-xl transition font-medium" href="<?php echo esc_url( get_the_permalink( $post_id ) ); ?>">
						<h2><?php echo esc_html( $post['title'] ); ?></h2>
					</a>
					<?php if ( $show_category ) : ?>
					<div class="inline-block mt-2">
						<!-- get site categoris -->
						<?php
						$categories = get_the_category( $post_id );
						if ( count( $categories ) > 0 ) :
							foreach ( $categories as $cat ) :
								?>
								<a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>" class="post-card__category inline-block text-xs capitalize p-1 mr-1 rounded-md transition-all">
									<?php echo esc_html( $cat->name ); ?>
								</a>
								<?php
							endforeach;
						endif;
						?>
					</div>
					<?php endif; ?>
					<?php if ( $show_excerpt ) : ?>
					<div class="post-card__excerpt mt-2"><?php echo wp_kses_post( $post['excerpt'] ); ?></div>
					<?php endif; ?>
				</div>
			<?php endwhile; ?>
		<?php else : ?>
			<div class="post-card shadow-md hover:shadow-lg rounded border-solid border-x border-y p-8">
				<h2 class="post-card__title mt-4 inline-block font-poppins text-xl transition font-medium"><?php echo esc_html__( 'No Posts Found', 'newsly' ); ?></h2>
			</div>
		<?php endif; ?>
		<?php
		die();
	}
}