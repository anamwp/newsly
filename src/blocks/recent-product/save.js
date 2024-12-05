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
	console.log('props', props);
	/**
	 * get block props and
	 * assign it to a variable
	 */
	const blockProps = useBlockProps.save({
		className: 'gts_block__recent_product',
	});
	/**
	 * return save data
	 *  */
	return (
		<div {...blockProps}>
			<div className="container gts_block__recent_product__container">
				<h2>Recent Products</h2>
				<div className="row">
					{props.attributes.product_obj &&
						props.attributes.product_obj.map(function (p, index) {
							let onSale = p.on_sale;
							return (
								<div key={index} className="col-md-3">
									<h2>
										<a href={p.permalink}>{p.name}</a>
									</h2>
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
