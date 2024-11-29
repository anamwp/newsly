<?php 
	// namespace Anam\GutenbergStarter\Blocks\Inc;
/**
 * Summary.
 *
 * @since Version 3 digits
 */
class Class_Movie_List_Render_Callback {
	/**
	 * Undocumented variable
	 *
	 * @var [type]
	 */
	private static $instance;
	public $block_attributes;
	public $new_genres = [];
	public $content;

	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	// public static function init() {
	// 	if ( null === self::$instance ) {
	// 		self::$instance = new self();
	// 	}
	// 	return self::$instance;
	// }

	/**
	 * Construct of Class
	 */
	public function __construct() {
		add_action('wp_head', array($this, 'init_resources'));
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
	 * Movie list block ajax callback from pagination
	 *
	 * @return void
	 */
	public function handle_movie_list_block_ajax_pagination(){
		$requested_movie_content = '';
		$total_pages = '';

		$get_movie_data = wp_remote_get( 'https://api.themoviedb.org/3/movie/popular?api_key=94413492db5e2e4ca5e93402ca623fca&language=en-US&page='. $_POST['pageNumber'] );

		if ( is_array( $get_movie_data ) && ! is_wp_error( $get_movie_data ) ) {
			// $headers = $get_movie_data['headers']; // array of http header lines
			$requested_movie_content    = json_decode($get_movie_data['body']); // use the content
			// $total_pages = $requested_movie_content->total_pages;
			$total_pages = 10000;
		}

		if($requested_movie_content):
		?>
			<!-- <div class="movie-list"> -->
			<?php 
				foreach($requested_movie_content->results as $movie):
			?>
				<div class="movie-card" data-movieid="<?php echo $movie->id; ?>">
					<div class="movie-card__image">
						<img src="https://image.tmdb.org/t/p/w500/<?php echo $movie->poster_path; ?>" alt="<?php echo $movie->title; ?>">
						<div class="meta">
							<div class="language-date">
							<?php 
							// if(! array_key_exists('showLanguage', $this->block_attributes)){
								echo "<span class='language'>{$movie->original_language}</span>";
							// }
							// if(! array_key_exists('showReleaseDate', $this->block_attributes)){
								echo "<span class='date'>{$movie->release_date}</span>";
							// }
							?>
							</div>
							<div class="vote">
								<?php
								// if(! array_key_exists('showVoteAverage', $this->block_attributes) ){
									echo "<span class='vote-average'>{$movie->vote_average}</span>";
								// }
								// if(! array_key_exists('showVoteCount', $this->block_attributes)){
									echo " / <span class='vote-count'>{$movie->vote_count}</span>";
								// }
								?>
							</div>
						</div>
					</div>
					<div class="movie-card__content">
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
		<div class="movie-list-ajax-number-pagination">
			<?php
				echo paginate_links( array(
					// 'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
					'base' => 'https://api.themoviedb.org/3/movie/popular?api_key=94413492db5e2e4ca5e93402ca623fca&language=en-US'.'%_%',
					'format' => '&page=%#%',
					'number' => 3,
					'current' => max( 1, $anniversary_paged ),
					// 'current' => $anniversary_paged,
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
		$movie_api_data = '';
		$total_pages = '';
		if ( is_array( $get_movie_data ) && ! is_wp_error( $get_movie_data ) ) {
			$headers = $get_movie_data['headers']; // array of http header lines
			$movie_api_data    = json_decode($get_movie_data['body']); // use the content
			// $total_pages = $movie_api_data->total_pages;
			$total_pages = 10000; // api only give data for 10000 content
		}
		$column = array_key_exists('movieColumn', $this->block_attributes) ? $this->block_attributes['movieColumn'] : 4;
		/**
		 * Create new genres array with id as key
		 */
		foreach($this->block_attributes['genres'] as $key => $value){
			$this->new_genres[$value['id']] = $value;
		}
		// Default box values if not provided
		$title_padding_values = wp_parse_args( 
			$this->block_attributes['titlePaddingAttr'] ?? [], 
			[
				'top' => '0px',
				'right' => '0px',
				'bottom' => '0px',
				'left' => '0px',
			]
		);
	
		// Generate inline style
		$titlePadding = sprintf(
			'padding: %s %s %s %s;',
			esc_attr( $title_padding_values['top'] ),
			esc_attr( $title_padding_values['right'] ),
			esc_attr( $title_padding_values['bottom'] ),
			esc_attr( $title_padding_values['left'] )
		);
		if($movie_api_data):
		?>
			<style>
				.movie-list{
					grid-template-columns: repeat(<?php echo $column; ?>, 1fr);
				}
				.movie-list-ajax-number-pagination{
					grid-column-start: 1;
					grid-column-end: <?php echo +$column + 1; ?>
				}
				h2{
					font-size: <?php echo $this->block_attributes['titleFontSize'] . 'px'; ?>;
					font-weight: <?php echo $this->block_attributes['titleFontWeight']; ?>;
					letter-spacing: <?php echo $this->block_attributes['titleLetterSpacing'].'px';?>;
					line-height: <?php echo $this->block_attributes['titleLineHeight'];?>;
					font-style: <?php echo $this->block_attributes['titleStyle']; ?>;
					text-transform: <?php echo $this->block_attributes['titleTransform']; ?>;
					text-decoration: <?php echo $this->block_attributes['titleDecoration']; ?>;
					padding: <?php echo $titlePadding; ?>;
				}
			</style>
			<div id="popup-modal-for-movie-card" style='display: none;'>
				<div id="close-modal">close</div>
				<div id="fetched-movie-content"></div>
			</div>
			<div class="movie-list">
				<?php 
					foreach($movie_api_data->results as $movie):
				?>
					<div class="movie-card" data-movieid="<?php echo $movie->id; ?>">
						<div class="movie-card__image">
							<img src="https://image.tmdb.org/t/p/w500/<?php echo $movie->poster_path; ?>" alt="<?php echo $movie->title; ?>">
							<div class="meta">
								<div class="language-date">
								<?php 
								if( array_key_exists('showLanguage', $this->block_attributes) && $this->block_attributes['showLanguage'] == true){
									echo "<span class='language'>{$movie->original_language}</span>";
								}
								if( array_key_exists('showReleaseDate', $this->block_attributes) && $this->block_attributes['showReleaseDate'] == true){
									echo "<span class='date'>{$movie->release_date}</span>";
								}
								?>
								</div>
								<div class="vote">
									<?php
									if( array_key_exists('showVoteAverage', $this->block_attributes) && $this->block_attributes['showVoteAverage'] == true){
										echo "<span class='vote-average'>{$movie->vote_average}</span>";
									}
									if( array_key_exists('showVoteCount', $this->block_attributes) && $this->block_attributes['showVoteCount'] == true){
										echo " / <span class='vote-count'>{$movie->vote_count}</span>";
									}
									?>
								</div>
							</div>
						</div>
						<div class="movie-card__content">
							<h2><?php echo $movie->title; ?></h2>
							<p class="overview"><?php echo $movie->overview; ?></p>
							<div class="movie-card__content__footer">
								<?php if( array_key_exists('showGenre', $this->block_attributes) && $this->block_attributes['showGenre'] == true): ?>
								<div class="genre">
									<ul>
									<?php
										$get_details = $this->handle_genre_filter($movie->genre_ids);
										foreach($get_details as $genre){
											echo "<li>{$genre['name']}</li>";
										}
									?>
									</ul>
								</div>
								<?php endif; ?>
							</div>
						</div>
					</div>
				<?php
					endforeach;
				?>
				<?php
					$anniversary_paged = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 1;
					// $total_pages = $total_pages;
					$total_pages = ceil( $total_pages / 20 );
				?>
				<div class="movie-list-ajax-number-pagination">
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
			</div>
		<?php
		endif;
	}
	public function handle_genre_filter($arr){
		$new_arr_fill = array_fill_keys($arr, null);
		$intersection_arr = array_intersect_key($this->new_genres, $new_arr_fill);
		return $intersection_arr;
	}

}

$popular_movie_list_class = new Class_Movie_List_Render_Callback();
$popular_movie_list_class->handle_movie_list_block_content_from_api($attributes, $content);
