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
	public $movie_list_callback_instance;
	/**
	 * Initiate Class
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_block' ) );
		// add_action( 'init', array( $this, 'register_starter_blocks' ) );
		/**
		 * Initiniating Movie List Callback File
		 */
		$this->movie_list_callback_instance = Inc\Class_Movie_List_Callback::init();
	}
	public function register_block() {
		// dump(ANAM_GUTENBERG_STARTER_PATH);
		// dump(plugins_url());
		// dump(__DIR__);
		// function create_block_starter_block_init() {
			// foreach (glob(__DIR__ . '/blocks/*/**.php') as $file) {
			// include_once($file);
			// }
			register_block_type_from_metadata( ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/test' );
			register_block_type_from_metadata( ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/single-post' );
			register_block_type_from_metadata( ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/card' );
			register_block_type_from_metadata( ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/call-to-action' );
			register_block_type_from_metadata( ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/blurb' );
			register_block_type_from_metadata( ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/recent-product' );
			register_block_type_from_metadata( ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/post-lists-tab' );
			register_block_type_from_metadata( ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/theatres-movies' );
			register_block_type_from_metadata( ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/upcoming-movies' );
			register_block_type_from_metadata( ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/upcoming-movie-slider' );
			register_block_type_from_metadata( ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/top-rated-movie-lists' );
			register_block_type_from_metadata(
				ANAM_GUTENBERG_STARTER_PATH . '/build/blocks/movie-lists',
				array(
					'render_callback' => array( $this, 'movie_lists_render_frontend_callback' ),
				)
			);
		// }
	}
	/**
	 * Register Starter Blocks
	 * this function is not in use
	 * @return void
	 */
	public function register_starter_blocks() {
		// $asset_file = require(ANAM_GUTENBERG_STARTER_DIR_URL . 'build/index.asset.php');
		// $asset_file = include ANAM_GUTENBERG_STARTER_PATH . '/build/index.asset.php';
		/**
		 * register block script
		 */
		// wp_register_script(
		// 'starter-script',
		// ANAM_GUTENBERG_STARTER_DIR_URL . 'build/index.js',
		// $asset_file['dependencies'],
		// $asset_file['version']
		// );
		/**
		 * register blocks editor style
		 */
		// wp_register_style(
		// 'starter-editor-style',
		// ANAM_GUTENBERG_STARTER_DIR_URL . 'build/index.css',
		// array(),
		// $asset_file['version']
		// );
		/**
		 * Register blocks frontend style
		 */
		// wp_register_style(
		// 'starter-frontend-style',
		// ANAM_GUTENBERG_STARTER_DIR_URL . 'build/style-index.css',
		// array(),
		// $asset_file['version']
		// );

		/**
		 * Register block type
		 */
		/**
		 * Test Block
		 */
		register_block_type(
			'anam-guternberg-starter-block/test',
			array(
				'api_version'   => 2,
				'editor_script' => 'starter-script',
				'editor_style'  => 'starter-editor-style',
				'style'         => 'starter-frontend-style',
			)
		);
		/**
		 * Blurb Block
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
		/**
		 * Card Block
		 */
		register_block_type(
			'anam-guternberg-starter-block/card',
			array(
				'api_version'   => 2,
				'editor_script' => 'starter-script',
				'editor_style'  => 'starter-editor-style',
				'style'         => 'starter-frontend-style',
			)
		);
		/**
		 * Call to Action Block
		 */
		register_block_type(
			'anam-guternberg-starter-block/call-to-action',
			array(
				'api_version'   => 2,
				'editor_script' => 'starter-script',
				'editor_style'  => 'starter-editor-style',
				'style'         => 'starter-frontend-style',
			)
		);
		/**
		 * Single Post Block
		 */
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
		/**
		 * Post Lists Tab Block
		 */
		register_block_type(
			'anam-gutenberg-starter-block/post-lists-tab',
			array(
				'api_version'     => 2,
				'editor_script'   => 'starter-script',
				'editor_style'    => 'starter-editor-style',
				'style'           => 'starter-frontend-style',
				'render_callback' => array( $this, 'post_lists_tab_render_frontend_callback' ),
			)
		);
		/**
		 * Movie lists block
		 */
		// register_block_type(
		// 'anam-gutenberg-starter-block/movie-lists',
		// array(
		// 'api_version'     => 2,
		// 'editor_script'   => 'starter-script',
		// 'editor_style'    => 'starter-editor-style',
		// 'style'           => 'starter-frontend-style',
		// 'render_callback' => array( $this, 'movie_lists_render_frontend_callback' ),
		// )
		// );
		/**
		 * Top rated movie lists block
		 */
		// register_block_type(
		// 'anam-gutenberg-starter-block/top-rated-movie-lists',
		// array(
		// 'api_version'     => 2,
		// 'editor_script'   => 'starter-script',
		// 'editor_style'    => 'starter-editor-style',
		// 'script'   => 'starter-script',
		// 'style'           => 'starter-frontend-style',
		// )
		// );
		/**
		 * Upcoming movie lists block
		 */
		// register_block_type(
		// 'anam-gutenberg-starter-block/upcoming-movies',
		// array(
		// 'api_version'     => 2,
		// 'editor_script'   => 'starter-script',
		// 'editor_style'    => 'starter-editor-style',
		// 'script'   => 'starter-script',
		// 'style'           => 'starter-frontend-style',
		// )
		// );
		/**
		 * Theatres movies lists block
		 */
		// register_block_type(
		// 'anam-gutenberg-starter-block/theatres-movies',
		// array(
		// 'api_version'     => 3,
		// 'editor_script'   => 'starter-script',
		// 'editor_style'    => 'starter-editor-style',
		// 'script'     => 'starter-script',
		// 'style'           => 'starter-frontend-style',
		// )
		// );
		/**
		 * Recent Product Block
		 */
		if ( class_exists( 'woocommerce' ) ) :
			register_block_type(
				'anam-guternberg-starter-block/recent-product',
				array(
					'api_version'     => 2,
					'editor_script'   => 'starter-script',
					'editor_style'    => 'starter-editor-style',
					'style'           => 'starter-frontend-style',
					'render_callback' => array( $this, 'recent_product_render_frontend_callback' ),
				)
			);
		endif;
	}
	/**
	 * Single Post Block Frontend Render Callback
	 * This function not in use
	 * 
	 * @param [type] $block_attributes
	 * @param [type] $content
	 * @return void
	 */
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
			elseif ( array_key_exists( 'selectedPostId', $block_attributes ) && $selected_post_ID ) :
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
	/**
	 * Recent Product Block Frontend Render Callback
	 * This function not in use
	 * 
	 * @param [type] $block_attributes
	 * @param [type] $content
	 * @return void
	 */
	public function recent_product_render_frontend_callback( $block_attributes, $content ) {

		$args = array(
			'post_type'      => 'product',
			'posts_per_page' => 3,
		);

		$loop = new \WP_Query( $args );
		ob_start();
		?>
		<h2>Recent Products</h2>
		<div class="row">
		<?php
		while ( $loop->have_posts() ) :
			$loop->the_post();
			$product = wc_get_product( get_the_ID() );
			?>
			<div class="col-md-3">
				<h2>
					<a href="<?php the_permalink(); ?>">
						<?php the_title(); ?>
					</a>

				</h2>
				<p class="product_price">
					<?php echo $product->get_price_html(); ?>
				</p>
			</div>
			<?php

		endwhile;
		wp_reset_query();
		?>
		</div>
		<?php

		$output = ob_get_clean();
		return $output;
	}
	/**
	 * Post Lists Tab Block Frontend Render callback
	 * This function not in use
	 * 
	 * @param [type] $block_attributes
	 * @param [type] $content
	 * @return void
	 */
	public function post_lists_tab_render_frontend_callback( $block_attributes, $content ) {
		ob_start();
		$args = array(
			'post_type'      => 'post',
			'posts_per_page' => 3,
		);
		echo '<pre>';
		var_dump( $args );
		echo '</pre>';
		$output = ob_get_clean();
		return $output;
	}
	/**
	 * Movie List Block Frontend Render Callback
	 * This function not in use
	 * 
	 * @param [type] $block_attributes
	 * @param [type] $content
	 * @return void
	 */
	public function movie_lists_render_frontend_callback( $block_attributes, $content, $block ) {
		/**
		 * $block_attributes is coming from attributes or block.json
		 * $content is coming from save.js
		 */
		ob_start();
		$this->movie_list_callback_instance->handle_movie_list_block_content_from_api( $block_attributes, $content, $block );
		$output = ob_get_clean();
		return $output;
	}
}

?>
