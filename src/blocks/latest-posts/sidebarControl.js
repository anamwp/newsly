import { __ } from '@wordpress/i18n';
import { useSelect, withSelect, select } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, RangeControl } from '@wordpress/components';
import React from 'react';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

export default function sidebarControl({
	props,
	categories,
	handleNumberOfPostsChange,
	handleCategoryChange,
// handleSelectedPostData,
	handleCategoryToggleControl,
	handleExcerptToggleControl,
	handleFeaturedImageToggleControl,
	handleIgnoreStickyPostsToggleControl,
}) {
	const { attributes, setAttributes } = props;

	return (
		<InspectorControls>
				<PanelBody
					title={__('Featured Posts Controls', 'newsly')}
					initialOpen={true}
				>
					<p className="featured-posts-category-picker">
						<SelectControl
							label={__(
								'Choose Category',
								'newsly'
							)}
							value={attributes.selectedCategroyId}
							options={categories}
							onChange={handleCategoryChange}
						/>
					</p>
					<p>
						<RangeControl
							label={__(
								'Number of Posts',
								'newsly'
							)}
							value={attributes.numberOfPosts}
							onChange={handleNumberOfPostsChange}
							min={1}
							max={10}
							step={1}
						/>
					</p>
					{attributes.selectedCategroyId && (
						<p className="display-featured-posts-featured-image">
							<ToggleControl
								label={__(
									'Show Featured Image',
									'newsly'
								)}
								checked={attributes.showFeaturedImage}
								onChange={handleFeaturedImageToggleControl}
							/>
						</p>
					)}
					{attributes.selectedCategroyId && (
						<p className="display-featured-posts-category-switch">
							<ToggleControl
								label={__('Show Category', 'newsly')}
								checked={attributes.showCategory}
								onChange={handleCategoryToggleControl}
							/>
						</p>
					)}
					{attributes.selectedCategroyId && (
						<p className="display-featured-posts-excerpt-switch">
							<ToggleControl
								label={__('Show Excerpt', 'newsly')}
								checked={attributes.showExcerpt}
								onChange={handleExcerptToggleControl}
							/>
						</p>
					)}
					<p className="display-featured-posts-category-switch">
						<ToggleControl
							label={__('Ignore Sticky Posts', 'newsly')}
							checked={attributes.ignoreStickyPosts}
							onChange={handleIgnoreStickyPostsToggleControl}
						/>
					</p>
				</PanelBody>
			</InspectorControls>
	);
}
