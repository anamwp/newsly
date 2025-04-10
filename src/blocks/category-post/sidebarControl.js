import { __ } from '@wordpress/i18n';
import React from 'react';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';

export default function sidebarControl({
	props,
	categories,
	handleCategoryChange,
	handleNumberofPoststoShow,
	handleNumberofPostsColumn,
	handleCategoryToggleControl,
	handleExcerptToggleControl,
	handleFeaturedImageToggleControl,
}) {
	const { attributes, setAttributes } = props;

	return (
		<div>
			<InspectorControls>
				<PanelBody
					title={__('Single Post Controls', 'gutenberg-starter')}
					initialOpen={true}
				>
					<p className="category-post-category-picker">
						<SelectControl
							label={__(
								'Choose Category',
								'anam-gutenberg-starter'
							)}
							value={attributes.selectedCategroyId}
							options={categories}
							onChange={handleCategoryChange}
						/>
					</p>
					{attributes.selectedCategroyId && (
						<p>
							<SelectControl
								label={__(
									'Posts Found to display',
									'gutenberg-starter'
								)}
								options={attributes.selectedCategoryPosts}
								// onChange={handleSelectedPostData}
							/>
							<RangeControl
								label="Posts to show"
								value={attributes.postsToShow ?? 4}
								onChange={(value) =>
									handleNumberofPoststoShow(value)
								}
								min={1}
								max={24}
							/>
						</p>
					)}
					{attributes.selectedCategroyId && (
						<p className="display-category-post-featured-image">
							<ToggleControl
								label={__(
									'Show Featured Image',
									'gutenberg-starter'
								)}
								checked={attributes.showFeaturedImage}
								onChange={handleFeaturedImageToggleControl}
							/>
						</p>
					)}
					{attributes.selectedCategroyId && (
						<p className="display-category-post-category-switch">
							<ToggleControl
								label={__('Show Category', 'gutenberg-starter')}
								checked={attributes.showCategory}
								onChange={handleCategoryToggleControl}
							/>
						</p>
					)}
					{attributes.selectedCategroyId && (
						<p className="display-category-post-excerpt-switch">
							<ToggleControl
								label={__('Show Excerpt', 'gutenberg-starter')}
								checked={attributes.showExcerpt}
								onChange={handleExcerptToggleControl}
							/>
						</p>
					)}
					{attributes.selectedCategroyId && (
						<RangeControl
							label="Post Column"
							value={attributes.postColumn ?? 4}
							onChange={(value) =>
								handleNumberofPostsColumn(value)
							}
							min={1}
							max={4}
						/>
					)}
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
