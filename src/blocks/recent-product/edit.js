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

const api = new WooCommerceRestApi({
	url: envVars.GS_SITE_URL,
	consumerKey: envVars.WC_CONSUMER_KEY,
	consumerSecret: envVars.WC_CONSUMER_SECRET,
	version: 'wc/v3',
});

export default function edit({ attributes, setAttributes }) {
	const productPerPage = attributes.no_of_product_to_show;
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
		})
			.then((response) => {
				/**
				 * Update product attributes
				 * with the latest content
				 */
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
	/**
	 * Pass style through useBlockProps()
	 */
	const blockProps = useBlockProps({
		className: attributes.className,
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
