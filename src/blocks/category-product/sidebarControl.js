import { __ } from '@wordpress/i18n';
import React, { Suspense, useEffect } from 'react';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import WooCommerceAPI from '../components/WooCommerceAPI';
import { ErrorBoundary } from 'react-error-boundary';

export default function sidebarControl({
	attributes,
	setAttributes,
	handleUpdateCategoryProduct,
	loading,
	setIsLoading,
}) {
	const default_product_to_show_value = 3;
	const [fetchPromise, setFetchPromise] = React.useState(Promise.resolve([]));

	useEffect(() => {
		const wooPromise = WooCommerceAPI({
			restURL: 'products/categories',
			params: {
				per_page: 100,
				hide_empty: true, // Exclude categories with no products
			},
		});
		// setFetchPromise(wooPromise);
		wooPromise
			.then((response) => {
				setAttributes({ product_category: response });
			})
			.catch((error) => console.error('API Error:', error));
	}, []);

	useEffect(() => {
		if (!attributes.selected_category) {
			return;
		}
		const wooProductPromise = WooCommerceAPI({
			restURL: 'products',
			params: {
				per_page: attributes.no_of_product_to_show,
				hide_empty: true,
				category: attributes.selected_category,
			},
		});
		wooProductPromise
			.then((response) => {
				setAttributes({ product_obj: response });
				setIsLoading(false);
			})
			.catch((error) => console.error('API Error:', error));
	}, [attributes.selected_category]);

	const WooCategories = () => {
		/**
		 * Throw promise for the susspense fallback
		 * to show loading state
		 * @see https://react.dev/reference/react/Suspense#suspense-fallback
		 */
		if (attributes.product_category.length == 0) {
			throw fetchPromise;
		}
		return (
			<SelectControl
				label={__('Select Category', 'gutenberg-starter')}
				value={attributes.selected_category}
				options={attributes.product_category.map((category) => ({
					label: category.name,
					value: category.id,
				}))}
				onChange={(value) => {
					setIsLoading(true);
					setAttributes({ selected_category: value });
				}}
				disabled={loading}
				aria-disabled={loading}
			/>
		);
	};

	const RefreshProductsComponent = () => {
		if (attributes.product_category.length == 0) {
			throw fetchPromise;
		}
		return (
			<p className="display-single-post-featured-image mb-3 flex align-middle flex-row justify-between">
				<Button
					type="button"
					className="button is-primary"
					onClick={handleUpdateCategoryProduct}
					disabled={loading}
					aria-disabled={loading}
					aria-label={__('Refresh Products', 'gutenberg-starter')}
				>
					{loading
						? __('Loading...', 'gutenberg-starter')
						: __('Refresh Products', 'gutenberg-starter')}
				</Button>
				{loading && <span className="spinner is-active m-0"></span>}
			</p>
		);
	};
	return (
		<ErrorBoundary
			fallback={
				<p>{__('Error in sidebar panel', 'gutenberg-starter')}</p>
			}
		>
			<div>
				<InspectorControls>
					<PanelBody
						title={__('Product', 'gutenberg-starter')}
						initialOpen={true}
					>
						{attributes.selected_category && (
							<Suspense
								fallback={
									<p className="flex justify-between flex-row align-middle text-center text-current p-2 bg-slate-300 mt-3 mb-3 rounded">
										<span>
											{__(
												'Let load the category first',
												'gutenberg-stater'
											)}
										</span>
										<span className="spinner is-active m-0"></span>
									</p>
								}
							>
								<RefreshProductsComponent />
							</Suspense>
						)}

						<Suspense
							fallback={
								<p className="flex justify-between flex-row align-middle text-center text-current p-2 bg-slate-300 mt-3 mb-3 rounded">
									<span>
										{__(
											'Loading categories from the API...',
											'gutenberg-starter'
										)}
									</span>
									<span className="spinner is-active m-0"></span>
								</p>
							}
						>
							<WooCategories />
						</Suspense>
						{attributes.product_category.length > 0 && (
							<RangeControl
								label={__(
									'Number of Products',
									'gutenberg-starter'
								)}
								value={attributes.no_of_product_to_show}
								onChange={(value) =>
									setAttributes({
										no_of_product_to_show: value,
									})
								}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
								min={1}
								max={9}
								step={1}
								initialPosition={default_product_to_show_value}
								allowReset={true}
								resetFallbackValue={
									default_product_to_show_value
								}
								resetLabel={__('Reset', 'gutenberg-starter')}
								resetTooltip={__(
									'Reset to default value',
									'gutenberg-starter'
								)}
								disabled={loading}
								aria-disabled={loading}
							/>
						)}
					</PanelBody>
				</InspectorControls>
			</div>
		</ErrorBoundary>
	);
}
