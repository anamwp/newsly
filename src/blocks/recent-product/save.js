import { __ } from '@wordpress/i18n';
import React, { useEffect } from 'react';
import { TextControl } from '@wordpress/components';

import {
	useBlockProps,
	RichText,
	AlignmentToolbar,
	BlockControls,
	ColorPalette,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';

export default function save(props) {
	// console.log('hello world');
	const { attributes } = props;
	console.log('attributes', attributes);
	/**
	 * get block props and
	 * assign it to a variable
	 */
	const blockProps = useBlockProps.save({
		className: attributes.className,
	});
	/**
	 * Extract products from attributes
	 */
	const recentProducts =
		attributes.product_obj.length > 0 ? attributes.product_obj : [];
	/**
	 * return save data
	 *  */
	return (
		<div {...blockProps}>
			<div className="container gs_block__recent_product__container">
				<h2 className="text-2xl">
					{__('Recent Products', 'gutenberg-starter')}
				</h2>
				<div className="grid grid-cols-3 gap-5">
					{recentProducts &&
						recentProducts.map(function (p, index) {
							let productTitle = p.name;
							let onSale = p.on_sale;
							let featuredImage = p.images[0].src;
							let productId = p.id;
							let addToCartUrl = `?add-to-cart=${productId}`;
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
									/>
									<a href={p.permalink}>{productTitle}</a>
									<p
										className="product_price"
										dangerouslySetInnerHTML={{
											__html: p.price_html,
										}}
									></p>
									{isSimple ? (
										<button
											className="add_to_cart_button ajax_add_to_cart bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all mt-2 flex items-center justify-center gap-2"
											data-product_id={p.id}
											data-product_sku={p.sku}
											data-quantity="1"
											aria-label={`Add “${p.name}” to your cart`}
											rel="nofollow"
										>
											<span className="add-to-cart-text">
												Add to Cart
											</span>
											<span className="spinner hidden animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
										</button>
									) : (
										<a
											href={p.permalink}
											className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all mt-2"
										>
											View Options
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
