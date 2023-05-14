<?php
	namespace Anam\GutenbergStarter\Blocks;

class Block {
	/**
	 * Undocumented variable
	 *
	 * @var [type]
	 */
	private static $instance;
	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * Undocumented function
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_starter_blocks' ) );
	}

	public function register_starter_blocks() {
		// $asset_file = require(ANAM_GUTENBERG_STARTER_DIR_URL . 'build/index.asset.php');
		$asset_file = include ANAM_GUTENBERG_STARTER_PATH . '/build/index.asset.php';
		/**
		 * register block script
		 */
		wp_register_script(
			'starter-script',
			ANAM_GUTENBERG_STARTER_DIR_URL . 'build/index.js',
			$asset_file['dependencies'],
			$asset_file['version']
		);
		/**
		 * register blocks editor style
		 */
		wp_register_style(
			'starter-editor-style',
			ANAM_GUTENBERG_STARTER_DIR_URL . 'build/index.css',
			array(),
			$asset_file['version']
		);
		/**
		 * Register blocks frontend style
		 */
		wp_register_style(
			'starter-frontend-style',
			ANAM_GUTENBERG_STARTER_DIR_URL . 'build/style-index.css',
			array(),
			$asset_file['version']
		);

		/**
		 * Register block type
		 */
		register_block_type(
			'anam-guternberg-starter-block/blurb',
			array(
				'api_version'   => 2,
				'editor_script' => 'starter-script',
				'editor_style'  => 'starter-editor-style',
				'style'         => 'starter-frontend-style',
			)
		);
		register_block_type(
			'anam-guternberg-starter-block/test',
			array(
				'api_version'   => 2,
				'editor_script' => 'starter-script',
				'editor_style'  => 'starter-editor-style',
				'style'         => 'starter-frontend-style',
			)
		);
		register_block_type(
			'anam-guternberg-starter-block/call-to-action',
			array(
				'api_version'   => 2,
				'editor_script' => 'starter-script',
				'editor_style'  => 'starter-editor-style',
				'style'         => 'starter-frontend-style',
			)
		);
		register_block_type(
			'anam-gutenberg-starter-block/single-post',
			array(
				'api_version'     => 2,
				'editor_script'   => 'starter-script',
				'editor_style'    => 'starter-editor-style',
				'style'           => 'starter-frontend-style',
				'render_callback' => array( $this, 'single_post_render_frontend_callback' ),
			)
		);
	}

	public function single_post_render_frontend_callback( $block_attributes, $content ) {
		/**
		 * assign post id from
		 * block attributes array
		 * if nothing found
		 * assing empty
		 */
		$selected_post_ID = array_key_exists( 'selectedPostId', $block_attributes ) ? +$block_attributes['selectedPostId'] : '';
		/**
		 * assing category id
		 * from block attributes
		 * if nothing found
		 * then assign empty
		 */
		$selected_category_ID = array_key_exists( 'selectedCategroyId', $block_attributes ) ? +$block_attributes['selectedCategroyId'] : '';
		/**
		 * display data from attributes
		 * if no saved data attribute found
		 * then run query and fetch recent posts
		 */
		if ( array_key_exists( 'fetchedPosts', $block_attributes ) ) :
			$recent_posts = $block_attributes['fetchedPosts'][0];
			else :
				if ( array_key_exists( 'selectedPostId', $block_attributes ) && $selected_post_ID ) :
					$recent_posts = wp_get_recent_posts(
						array(
							'numberposts' => -1,
							'post_status' => 'publish',
							'p'           => $selected_post_ID,
						// 'cat' => $selected_category_ID
						)
					);
				else :
					return 'No post found to display';
				endif;
			endif;
			/**
			 * if no post found
			 * return fall back message
			 */
			if ( count( $recent_posts ) === 0 ) {
				return 'No posts found';
			}
			ob_start();
			/**
			 * get the category array of a post
			 * then fetch those data
			 */
			if ( ! array_key_exists( 'showCategory', $block_attributes ) ) :
				$single_post_cat_arr  = $recent_posts['categories'];
				$single_post_cat_data = get_terms(
					'category',
					array(
						'include' => $recent_posts['categories'],
					)
				);
			endif;
			if ( array_key_exists( 'selectedCategroyId', $block_attributes ) ) :
				?>
				<div class="single-post-card">
					<?php if ( ! array_key_exists( 'showFeaturedImage', $block_attributes ) ) : ?>
					<div class="featured-image">
						<?php
							echo get_the_post_thumbnail( $recent_posts['id'], 'full' );
						?>
					</div>
					<?php endif; ?>
					<?php if ( ! array_key_exists( 'showCategory', $block_attributes ) ) : ?>
						<div>
							<?php foreach ( $single_post_cat_data as $cat_data ) : ?>
								<a href="<?php echo get_term_link( $cat_data->term_id ); ?>">
									<?php echo $cat_data->name; ?>
								</a>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
					<h3>
						<a href="<?php echo get_the_permalink( $recent_posts['id'] ); ?>">
							<?php echo get_the_title( $recent_posts['id'] ); ?>
						</a>
					</h3>
					<?php if ( ! array_key_exists( 'showExcerpt', $block_attributes ) ) : ?>
						<div>
							<?php
							echo $recent_posts['excerpt']['rendered'];
							?>
						</div>
					<?php endif; ?>
				</div>
				<?php
			else :
				?>
				<div>
					<p>Please select a category first from block settings</p>
				</div>
				<?php
			endif;
			$output = ob_get_clean();
			return $output;
	}
}

?>
