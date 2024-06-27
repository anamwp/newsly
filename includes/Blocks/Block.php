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
		
		add_action('wp_head', array( $this, 'handle_movie_pagination' ));
		add_action( 'wp_ajax_nopriv_movie_pagination', array( $this, 'handle_movie_ajax_pagination' ) );
		add_action( 'wp_ajax_movie_pagination', array( $this, 'handle_movie_ajax_pagination' ) );
	}
	public function handle_movie_pagination(){
		?>
		<script>
			(function($){
				$(document).ready(function(){
					function getPageNumberFromUrl(url) {
						// Create an anchor element to use the browser's built-in URL parsing
						// var anchor = document.createElement('a');
						// anchor.href = url;

						// Extract query parameters from the URL
						// var queryParams = getPageNumberFromUrl(anchor.href)
						var queryParams = url.split('&');
						// Iterate through query parameters to find 'page' parameter
						for (var i = 0; i < queryParams.length; i++) {
						var param = queryParams[i].split('=');
						if (param[0] === 'page') {
							return param[1];
						}
						}
						// Return null if 'page' parameter is not found
						return null;
					}
					$(document).on('click', '.cgl-ajax-number-pagination a', function(e){
						e.preventDefault();
						var page = $(this).attr('href');
						var pageNumber = getPageNumberFromUrl(page);
						console.log(pageNumber);
						$.ajax({
							url: anamajaxpagination.ajaxurl,
							type: 'get',
							data: {
								action: 'movie_pagination',
								pageNumber: pageNumber,
							},
							success: function(response){
								console.log('response', response);
							}
						});
					});
				});
			})(jQuery);
		</script>
		<?php
	}

	public function register_starter_blocks() {
		wp_enqueue_script('jquery');
		// wp_enqueue_script('jquery', false, array(), false, false);

		wp_localize_script( 'jquery', 'anamajaxpagination', array(
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
		));
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
		/**
		 * 
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
		register_block_type(
			'anam-gutenberg-starter-block/movie-lists',
			array(
				'api_version'     => 2,
				'editor_script'   => 'starter-script',
				'editor_style'    => 'starter-editor-style',
				'style'           => 'starter-frontend-style',
				'render_callback' => array( $this, 'movie_lists_render_frontend_callback' ),
			)
		);
		
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

	public function single_post_render_frontend_callback( $block_attributes, $content ) {
		echo '<pre>';
		var_dump('hello');
		echo '</pre>';
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
	public function recent_product_render_frontend_callback( $block_attributes, $content ) {

		$args = array(
			'post_type'      => 'product',
			'posts_per_page' => 3
		);
	
		$loop = new \WP_Query( $args );
		ob_start();
		?>
		<h2>Recent Products</h2>
		<div class="row">
		<?php	
		while ( $loop->have_posts() ) : $loop->the_post();
			$product = wc_get_product( get_the_ID() );
			?>
			<div class="col-md-3">
				<h2>
					<a href="<?php the_permalink(); ?>">
						<?php the_title(); ?>
					</a>

				</h2>
				<p class="product_price">
					<?php echo $product->get_price_html() ?>
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
	public function post_lists_tab_render_frontend_callback( $block_attributes, $content ){
		ob_start();
		$args = array(
			'post_type'      => 'post',
			'posts_per_page' => 3
		);
		echo '<pre>';
		var_dump($args);
		echo '</pre>';
		$output = ob_get_clean();
		return $output;
	}
	public function movie_lists_render_frontend_callback($block_attributes, $content){
		ob_start();
		$get_movie_data = wp_remote_get( 'https://api.themoviedb.org/3/movie/popular?api_key=94413492db5e2e4ca5e93402ca623fca&language=en-US&page=1' );
		$body = '';
		$total_pages = '';
		if ( is_array( $get_movie_data ) && ! is_wp_error( $get_movie_data ) ) {
			$headers = $get_movie_data['headers']; // array of http header lines
			$body    = json_decode($get_movie_data['body']); // use the content
			$total_pages = $body->total_pages;
		}
		if($body):
		?>
			<div class="movie-list">
				<?php 
					foreach($body->results as $movie):
				?>
					<div class="movie-card">
						<div class="movie-image">
							<img src="https://image.tmdb.org/t/p/w500/<?php echo $movie->poster_path; ?>" alt="<?php echo $movie->title; ?>">
						</div>
						<div class="movie-content">
							<h2><?php echo $movie->title; ?></h2>
							<p class="overview"><?php echo $movie->overview; ?></p>
						</div>
					</div>
				<?php
					endforeach;
				?>
			</div>
		<?php
		$anniversary_paged = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 1;
		$total_pages = $total_pages;
		$total_pages = ceil( $total_pages / 20 );
		?>
		</div>
		<div class="cgl-ajax-number-pagination">
			<?php
				echo paginate_links( array(
					// 'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
					'base' => 'https://api.themoviedb.org/3/movie/popular?api_key=94413492db5e2e4ca5e93402ca623fca&language=en-US'.'%_%',
					'format' => '&page=%#%',
					'number' => 3,
					// 'current' => max( 1, get_query_var('paged') ),
					'current' => $anniversary_paged,
					'total' =>  $total_pages,
				) );
			?>
		</div>
		<?php
		endif;
		
		$output = ob_get_clean();
		return $output;
	}
	public function handle_movie_ajax_pagination(){
		$get_movie_data = wp_remote_get( 'https://api.themoviedb.org/3/movie/popular?api_key=94413492db5e2e4ca5e93402ca623fca&language=en-US&page='. $_POST['pageNumber'] );
		$pagination_body = '';
		$total_pages = '';
		if ( is_array( $get_movie_data ) && ! is_wp_error( $get_movie_data ) ) {
			// $headers = $get_movie_data['headers']; // array of http header lines
			$pagination_body    = json_decode($get_movie_data['body']); // use the content
			$total_pages = $pagination_body->total_pages;
		}
		if($pagination_body):
		?>
			<div class="movie-list">
				<?php 
					foreach($pagination_body->results as $movie):
				?>
					<div class="movie-card">
						<div class="movie-image">
							<img src="https://image.tmdb.org/t/p/w500/<?php echo $movie->poster_path; ?>" alt="<?php echo $movie->title; ?>">
						</div>
						<div class="movie-content">
							<h2><?php echo $movie->title; ?></h2>
							<p class="overview"><?php echo $movie->overview; ?></p>
						</div>
					</div>
				<?php
					endforeach;
				?>
			</div>
		<?php
		$anniversary_paged = $_POST['pageNumber'];
		$total_pages = $total_pages;
		$total_pages = ceil( $total_pages / 20 );
		?>
		</div>
		<div class="cgl-ajax-number-pagination">
			<?php
				echo paginate_links( array(
					// 'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
					'base' => 'https://api.themoviedb.org/3/movie/popular?api_key=94413492db5e2e4ca5e93402ca623fca&language=en-US'.'%_%',
					'format' => '&page=%#%',
					'number' => 3,
					// 'current' => max( 1, get_query_var('paged') ),
					'current' => $anniversary_paged,
					'total' =>  $total_pages,
				) );
			?>
		</div>
		<?php
		endif;
		die();
	}
}

?>
