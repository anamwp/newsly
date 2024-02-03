<?php
	namespace Anam\GutenbergStarter\Shortcode;

class Breweries {
	/**
	 * self instance
	 * of this shortcode
	 *
	 * @var [type]
	 */
	private static $instance;
	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * constructor of
	 * this class
	 */
	private function __construct() {
		add_shortcode( 'breweries-shortcode', array( $this, 'render_shortcode_content_for_breweries' ) );
		// add_action('wp_ajax_nopriv_get_breweries_from_api', [$this, 'render_shortcode_content_for_breweries']);
		// add_action('wp_ajax_get_breweries_from_api', [$this, 'render_shortcode_content_for_breweries']);
	}
	/**
	 * function to render
	 * shortcode content
	 *
	 * @param [type] $atts
	 * @param string $content
	 * @return void
	 */
	public function render_shortcode_content_for_breweries( $atts, $content = '' ) {
		ob_start();
		?>
			<div class="shortcode-wrapper">
				Breweries
			</div>
		<?php
		$output = ob_get_clean();
		return $output;
	}
}

?>
