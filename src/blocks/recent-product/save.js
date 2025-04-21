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
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}
