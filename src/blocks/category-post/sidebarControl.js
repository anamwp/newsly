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
	handleFeaturedExcerptToggleControl,
	handleFeaturedImageToggleControl,
}) {
	const { attributes, setAttributes } = props;

	return (
		<div>
			<InspectorControls>
				<PanelBody
					title={__('Single Post Controls', 'newsly')}
					initialOpen={true}
				>
					<p className="category-post-category-picker">
						<SelectControl
							label={__(
								'Choose Categories',
								'newsly'
							)}
							value={attributes.selectedCategroyId}
							options={categories}
							onChange={handleCategoryChange}
							multiple={true}
						/>
					</p>
					{attributes.selectedCategroyId.length > 0 && (
						<p>
							{/* <SelectControl
								label={__(
									'Posts Found to display',
									'newsly'
								)}
								options={attributes.selectedCategoryPosts}
								// onChange={handleSelectedPostData}
							/> */}
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
					{attributes.selectedCategories.length > 0 && (
						<p className="display-category-post-featured-image">
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
					{attributes.selectedCategories.length > 0 && (
						<p className="display-category-post-category-switch">
							<ToggleControl
								label={__('Show Category', 'newsly')}
								checked={attributes.showCategory}
								onChange={handleCategoryToggleControl}
							/>
						</p>
					)}
					{attributes.selectedCategroyId &&
						attributes.layout === 'card' && (
							<p className="display-category-post-excerpt-switch">
								<ToggleControl
									label={__(
										'Show Excerpt',
										'newsly'
									)}
									checked={attributes.showExcerpt}
									onChange={handleExcerptToggleControl}
								/>
							</p>
						)}
					{/* )} */}
					{attributes.selectedCategroyId &&
						attributes.layout === 'grid' && (
							<p className="display-category-post-excerpt-switch">
								<ToggleControl
									label={__(
										'Show Featured Post Excerpt',
										'newsly'
									)}
									checked={attributes.showFeaturedExcerpt}
									onChange={
										handleFeaturedExcerptToggleControl
									}
								/>
							</p>
						)}
					{attributes.selectedCategories.length > 0 && (
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
					{(attributes.postColumn === 3 ||
						attributes.postColumn === 4) && (
						<p>
							<SelectControl
								label={__('Select Layout', 'newsly')}
								value={attributes.layout}
								options={[
									{
										label: 'Select Layout',
										value: '',
									},
									{
										label: 'Card',
										value: 'card',
									},
									{
										label: 'Grid',
										value: 'grid',
									},
								]}
								onChange={(value) =>
									setAttributes({ layout: value })
								}
							/>
						</p>
					)}
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
