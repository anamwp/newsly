import { __ } from '@wordpress/i18n';
import React, { useEffect } from 'react';
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
import { useState } from '@wordpress/element';
import SidebarControl from './sidebarControl';
import { useBlockProps } from '@wordpress/block-editor';
/**
 * Import env variables
 * from .env file
 * for Woocommerce authentication
 */
const api = new WooCommerceRestApi({
	url: envVars.GS_SITE_URL,
	consumerKey: envVars.WC_CONSUMER_KEY,
	consumerSecret: envVars.WC_CONSUMER_SECRET,
	version: 'wc/v3',
});

export default function edit({ attributes, setAttributes }) {
	const [isLoading, setIsLoading] = useState(false);
	const productPerPage = attributes.no_of_product_to_show;
	/**
	 * Fetch products from WooCommerce API
	 * and set it to product_obj
	 * on component mount
	 * using useEffect hook
	 * This will run only once
	 * when the component is mounted
	 * and not on every render
	 * because of empty dependency array
	 * [].
	 * If product_obj is already having
	 * products then it will not run
	 * the api call again.
	 * This is to prevent unnecessary
	 * api calls and to improve performance.
	 * If you want to run the api call
	 * on every render then you can
	 * remove the empty dependency array
	 * [] and it will run on every render.
	 * But this is not recommended
	 * because it will make unnecessary
	 * api calls and will slow down
	 * the performance of the block.
	 * So, it is better to use
	 * empty dependency array [].
	 * This will run only once
	 * when the component is mounted
	 * and not on every render.
	 */
	useEffect(() => {
		/**
		 * If product object is having products
		 * then return and not run api call.
		 */
		if (attributes.product_obj.length > 0) {
			return;
		}
		/**
		 * Call WooCommerce Rest API
		 * to get products
		 * By default it will get 20 products per page
		 */
		api.get('products', {
			per_page: productPerPage,
			featured: true,
		})
			.then((response) => {
				/**
				 * Update product attributes
				 * with the latest content
				 */
				setAttributes({
					product_obj: response.data,
				});
				/**
				 * For successful request below things will be helpful
				 * console.log('Response Status:', response.status);
				 * console.log('Response Headers:', response.headers);
				 * console.log('Response Data:', response.data);
				 * console.log(
						'Total of pages:',
						response.headers['x-wp-totalpages']
					);
				 * console.log('Total of items:', response.headers['x-wp-total']);
				 */
			})
			.catch((error) => {
				/**
				 * Invalid request, for 4xx and 5xx statuses
				 * console.log('Response Status:', error.response.status);
				 * console.log('Response Headers:', error.response.headers);
				 * console.log('Response Data:', error.response.data);
				 */
			})
			.finally(() => {
				// Always executed.
			});
	}, []);
	/**
	 * Pass style through useBlockProps()
	 */
	const blockProps = useBlockProps({
		className: attributes.className,
	});
	/**
	 * Refresh product if any product updated
	 * or any new product is added.
	 */
	const handleUpdateFeaturedProduct = () => {
		setIsLoading(true);
		api.get('products', {
			per_page: productPerPage,
			featured: true,
		}).then((response) => {
			setAttributes({ product_obj: response.data });
			setIsLoading(false);
		});
	};
	/**
	 * Extract products from attributes
	 */
	const featuredProducts =
		attributes.product_obj.length > 0 ? attributes.product_obj : [];
	/**
	 * return edit content
	 */
	return (
		<div {...blockProps}>
			<SidebarControl
				attributes={attributes}
				setAttributes={setAttributes}
				handleUpdateFeaturedProduct={handleUpdateFeaturedProduct}
				loading={isLoading}
			/>
			{/* View */}
			<div className="container gs_block__featured_product__container">
				<h2 className="text-2xl mb-7">
					{__('Featured Products', 'gutenberg-starter')}
				</h2>
				<div className="grid grid-cols-3 gap-5">
					{featuredProducts &&
						featuredProducts.map(function (p, index) {
							let productTitle = p.name;
							let featuredImage = p.images[0].src;
							const productType = p.type; // 'simple', 'variable', 'grouped', etc.
							const isSimple = productType === 'simple';
							return (
								<div
									key={index}
									className="gs__product_card bg-slate-200 p-4 rounded hover:bg-slate-300 transition-all"
								>
									<img
										src={featuredImage}
										alt={productTitle}
										className="mb-3 inline-block w-full rounded"
									/>
									<a
										className="text-xl font-medium font-roboto"
										href={encodeURI(p.permalink)}
									>
										{productTitle}
									</a>
									<p
										className="product_price"
										dangerouslySetInnerHTML={{
											__html: p.price_html,
										}}
									></p>
									{isSimple ? (
										<button
											className="add_to_cart_button ajax_add_to_cart bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-all mt-2 flex items-center justify-center gap-2"
											data-product_id={p.id}
											data-product_sku={p.sku}
											data-quantity="1"
											aria-label={`Add “${p.name}” to your cart`}
											rel="nofollow"
										>
											<span className="add-to-cart-text">
												{__(
													'Add to cart',
													'gutenberg-starter'
												)}
											</span>
											<span className="spinner hidden animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
										</button>
									) : (
										<a
											href={encodeURI(p.permalink)}
											className="inline-block bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-all mt-2"
										>
											{__(
												'View Product',
												'gutenberg-starter'
											)}
										</a>
									)}
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}
