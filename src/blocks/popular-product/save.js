import { __ } from '@wordpress/i18n';
import React from 'react';
import { useBlockProps } from '@wordpress/block-editor';

export default function save(props) {
	const { attributes } = props;
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
	const popularProducts =
		attributes.product_obj.length > 0 ? attributes.product_obj : [];
	/**
	 * return save data
	 *  */
	return (
		<div {...blockProps}>
			<div className="container gs_block__popular_product__container">
				<h2 className="text-2xl mb-7">
					{__('Popular Products', 'gutenberg-starter')}
				</h2>
				<div className="grid grid-cols-3 gap-5">
					{popularProducts &&
						popularProducts.map(function (p, index) {
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
