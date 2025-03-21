<?php
/**
 * Summary.
 *
 * Description.
 *
 * @since Version 3 digits
 * @package gutenberg-starter
 */

	namespace Anam\GutenbergStarter\Blocks\Inc;

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
		// dump( 'Post_List_Tab_Callback' );
		add_action( 'wp_ajax_nopriv_handle_category_post_content', array( $this, 'gs_handle_category_post_content' ) );
		add_action( 'wp_ajax_handle_category_post_content', array( $this, 'gs_handle_category_post_content' ) );
	}
	/**
	 * Ajax callback to get posts by category.
	 *
	 * @return void
	 */
	public function gs_handle_category_post_content() {
		/**
		 * Verify nonce for security.
		 */
		$gs_ajax_nonce = isset( $_POST['gsAjaxNonce'] ) ? sanitize_text_field( wp_unslash( $_POST['gsAjaxNonce'] ) ) : '';
		if ( empty( $gs_ajax_nonce ) || ! wp_verify_nonce( $gs_ajax_nonce, 'gs_ajax_nonce' ) ) {
			wp_send_json_error( array( 'message' => 'Invalid nonce' ) );
			die();
		}
		/**
		 * Check and sanitize inputs.
		 */
		$cat_slug = isset( $_POST['catSlug'] ) ? sanitize_text_field( wp_unslash( $_POST['catSlug'] ) ) : '';
		/**
		 * Query to get posts by category.
		 */
		$args = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'category_name'  => $cat_slug,
		);
		$posts = new \WP_Query( $args );
		?>
		<?php if ( $posts->have_posts() ) : ?>
			<?php while( $posts->have_posts() ) :
				$posts->the_post();
				$post_id = get_the_ID();
				$post = array(
					'id'      => $post_id,
					'title'   => get_the_title( $post_id ),
					'excerpt' => get_the_excerpt( $post_id ),
				);
				?>
				<div class="post card shadow-md hover:shadow-lg rounded border-solid border-black-200 border-x border-y p-8">
					<div class="thumbnail card__img rounded">
						<?php if ( has_post_thumbnail( $post_id ) ) : ?>
							<?php
								echo get_the_post_thumbnail( $post_id, 'large', array( 'class' => 'post-thumbnail rounded h-80 object-cover w-full' ) );
							?>
						<?php else : ?>
							<img class="rounded h-80 object-cover w-full" src="https://placehold.co/600x400" alt="Placeholder Image">
						<?php endif; ?>
					</div>
					<a class="mt-4 inline-block font-poppins text-xl text-slate-900 hover:text-emerald-600	transition font-medium" href="<?php echo esc_url( get_the_permalink( $post_id ) ); ?>">
						<h2><?php echo esc_html( $post['title'] ); ?></h2>
					</a>
					<div class="inline-block mt-2">
						<!-- get site categoris -->
						<?php
						$categories = get_the_category( $post_id );
						if ( count( $categories ) > 0 ) :
							foreach( $categories as $cat ) :
								?>
								<a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>" class="text-xs text-emerald-600 hover:text-emerald-800 transition-all">
									<?php echo esc_html( $cat->name ); ?>
								</a>
							<?php endforeach;
						endif;
						?>
					</div>
					
					<div class="text-slate-600 mt-2"><?php echo wp_kses_post( $post['excerpt'] ); ?></div>
				</div>
			<?php endwhile; ?>
		<?php else : ?>
			<div class="post card shadow-md hover:shadow-lg rounded border-solid border-black-200 border-x border-y p-8">
				<h2 class="mt-4 inline-block font-poppins text-xl text-slate-900 hover:text-emerald-600	transition font-medium"><?php echo esc_html( 'No Posts Found', 'gutenberg-starter' ); ?></h2>
			</div>
		<?php endif; ?>
		<?php
		die();
	}
}