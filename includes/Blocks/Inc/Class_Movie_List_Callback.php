<?php 
	namespace Anam\GutenbergStarter\Blocks\Inc;
/**
 * Summary.
 *
 * @since Version 3 digits
 */
class Class_Movie_List_Callback {
	/**
	 * Undocumented variable
	 *
	 * @var [type]
	 */
	private static $instance;
	public $block_attributes;
	public $content;

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
	 * Construct of Class
	 */
	public function __construct() {
		add_action('init', array($this, 'init_resources'));
		add_action('wp_head', array( $this, 'handle_script_for_movie_list_block' ));
		add_action( 'wp_ajax_nopriv_popular_movie_pagination', array( $this, 'handle_movie_list_block_ajax_pagination' ) );
		add_action( 'wp_ajax_popular_movie_pagination', array( $this, 'handle_movie_list_block_ajax_pagination' ) );
	}
	/**
	 * Init Block Resources
	 *
	 * @return void
	 */
	public function init_resources(){
		wp_enqueue_script('jquery');
		// wp_enqueue_script('jquery', false, array(), false, false);
		wp_localize_script( 'jquery', 'anamajaxpagination', array(
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
		));
	}
	/**
	 * Javascript for Movie List Block
	 *
	 * @return void
	 */
	public function handle_script_for_movie_list_block(){
		?>
		<script>
			(function($){
				$(document).ready(function(){
					function getPageNumberFromUrl(url) {
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
						$.ajax({
							url: anamajaxpagination.ajaxurl,
							type: 'post',
							data: {
								action: 'popular_movie_pagination',
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
	/**
	 * Movie list block ajax callback from pagination
	 *
	 * @return void
	 */
	public function handle_movie_list_block_ajax_pagination(){
		$pagination_body = '';
		$total_pages = '';

		$get_movie_data = wp_remote_get( 'https://api.themoviedb.org/3/movie/popular?api_key=94413492db5e2e4ca5e93402ca623fca&language=en-US&page='. $_POST['pageNumber'] );

		if ( is_array( $get_movie_data ) && ! is_wp_error( $get_movie_data ) ) {
			// $headers = $get_movie_data['headers']; // array of http header lines
			$pagination_body    = json_decode($get_movie_data['body']); // use the content
			$total_pages = $pagination_body->total_pages;
		}

		if($pagination_body):
		?>
			<!-- <div class="movie-list"> -->
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
			<!-- </div> -->
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
	/**
	 * Manage Movie List Block Content from API for the first time
	 *
	 * @param [type] $block_attributes
	 * @param [type] $content
	 * @return void
	 */
	public function handle_movie_list_block_content_from_api($block_attributes, $content) {
		$this->block_attributes = $block_attributes;
		$this->content = $content;
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
	}

}
