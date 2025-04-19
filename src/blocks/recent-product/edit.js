import { __ } from '@wordpress/i18n';
import React, { useEffect } from 'react';
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

import {
	TextControl,
	ColorPicker,
	Panel,
	PanelBody,
	PanelRow,
	FontSizePicker,
	CheckboxControl,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';
import { more } from '@wordpress/icons';

import {
	useBlockProps,
	RichText,
	AlignmentToolbar,
	BlockControls,
	ColorPalette,
	InnerBlocks,
	InspectorControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

const MY_TEMPLATE = [['core/button', { placeholder: 'Book Your Demo' }]];

const api = new WooCommerceRestApi({
	url: 'https://anamstarter.local/',
	consumerKey: 'ck_c891525480173c17a6be34e0ff34797271bee966',
	consumerSecret: 'cs_2960e30b1041ff1ddebae9746b95101c7e564f8a',
	version: 'wc/v3',
});

export default function edit({ attributes, setAttributes }) {
	useEffect(() => {
		console.log('product objs', attributes.product_obj);
		/**
		 * If product object is having products
		 * then return and not run api call.
		 */
		if (attributes.product_obj.length > 0) {
			return;
		}
		debugger;
		api.get('products', {
			per_page: 3, // 20 products per page
		})
			.then((response) => {
				setAttributes({
					product_obj: response.data,
				});
				// Successful request
				console.log('Response Status:', response.status);
				console.log('Response Headers:', response.headers);
				console.log('Response Data:', response.data);
				console.log(
					'Total of pages:',
					response.headers['x-wp-totalpages']
				);
				console.log('Total of items:', response.headers['x-wp-total']);
			})
			.catch((error) => {
				// Invalid request, for 4xx and 5xx statuses
				console.log('Response Status:', error.response.status);
				console.log('Response Headers:', error.response.headers);
				console.log('Response Data:', error.response.data);
			})
			.finally(() => {
				// Always executed.
			});
	}, []);

	console.log('product obj', attributes && attributes.product_obj);
	/**
	 * pass style through useBlockProps()
	 */
	const blockProps = useBlockProps({
		className: 'gs_block__recent_product',
	});
	/**
	 * Extract products from attributes
	 */
	const recentProducts =
		attributes.product_obj.length > 0 ? attributes.product_obj : [];
	/**
	 * return edit content
	 */
	return (
		<div {...blockProps}>
			{/* View */}
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
