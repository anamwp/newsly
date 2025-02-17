<?php
/**
 * Summary.
 *
 * Description.
 *
 * @since Version 3 digits
 */
namespace Anam\GutenbergStarter\Admin;

class Product_Tab {
	private static $instance;
	/**
	 * Instance of this class
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
		/**
		 * Add [meta information] custom tab to product add/edit page
		 */
		add_filter( 'woocommerce_product_data_tabs', array( $this, 'gs_product_tab__meta_information_callback' ), 10, 1 );
		/**
		 * Add fields for [meta information] custom tab
		 */
		add_action( 'woocommerce_product_data_panels', array( $this, 'gs_product_tab_panel__meta_information_callback' ) );
		/**
		 * Add [Shipping Information] extra text field to shipping tab
		 */
		add_action( 'woocommerce_product_options_shipping_product_data', array( $this, 'gs_add_extra_text_field_to_shipping_tab_callback' ) );
		/**
		 * Add [Return policy] extra text field to general tab
		 */
		add_action( 'woocommerce_product_options_general_product_data', array( $this, 'gs_add_extra_text_field_to_general_tab_callback' ) );
	}
	/**
	 * Product Add/Edit custom tabs
	 *
	 * @param array $default_tabs tabs.
	 *
	 * @return array $default_tabs
	 */
	function gs_product_tab__meta_information_callback( $default_tabs ) {

		global $post;

		$tabs = array(
			'wk_custom_tab' => array(
				'label'    => esc_html__( 'Meta Information', 'wk-webkul' ),
				'target'   => 'wk_custom_tab', // ID of tab field
				'priority' => 60,
				'class'    => array(),
			),
		);

		$default_tabs = array_merge( $default_tabs, $tabs );

		return $default_tabs;
	}
	/**
	 * Product Add/Edit custom tab field
	 *
	 * @return void
	 */
	function gs_product_tab_panel__meta_information_callback() {
		global $woocommerce, $post;

		?>
		<div id="wk_custom_tab" class="panel woocommerce_options_panel">
			<p class="form-field">
				<?php $pm_brand = get_post_meta( $post->ID, 'brand', true ); ?>
				<label for="pm-brand"><?php esc_html_e( 'Brand', 'wkc-customization' ); ?></label>
				<input type="text" readonly name="_pm_brand" id="pm-brand" value="<?php echo $pm_brand; ?>" />
			</p>
			<p class="form-field">
				<?php $warranty_information = get_post_meta( $post->ID, 'warrantyInformation', true ); ?>
				<label for="pm-addition-information"><?php esc_html_e( 'Warranty Information', 'wkc-customization' ); ?></label>
				<input type="text" readonly name="_pm_warranty_information" id="pm-addition-information" value="<?php echo $warranty_information; ?>" />
			</p>
		</div>

		<?php
	}

	public function gs_add_extra_text_field_to_shipping_tab_callback() {
		global $woocommerce, $post;
		$shipping_information = get_post_meta( $post->ID, 'shipping_tab_information', true );
		woocommerce_wp_text_input(
			array(
				'id'                => '_shipping_time',
				'label'             => __( 'Shipping Information', 'woocommerce' ),
				'description'       => __( 'Add an estimated delivery days number', 'woocommerce' ),
				'desc_tip'          => 'true',
				'type'              => 'text',
				'value'             => $shipping_information,
				'custom_attributes' => array(
					'readonly' => 'readonly',
				),
			)
		);
	}

	public function gs_add_extra_text_field_to_general_tab_callback() {
		global $woocommerce, $post;
		$return_policy = get_post_meta( $post->ID, 'returnPolicy', true );
		woocommerce_wp_text_input(
			array(
				'id'                => '_return_policy',
				'label'             => __( 'Return Policy', 'woocommerce' ),
				'description'       => __( 'Days for the return policy', 'woocommerce' ),
				'desc_tip'          => 'true',
				'type'              => 'text',
				'value'             => $return_policy ?? 'No return policy.',
				'custom_attributes' => array(
					'readonly' => 'readonly',
				),
			)
		);
	}
}