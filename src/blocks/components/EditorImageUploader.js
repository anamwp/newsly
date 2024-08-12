import React from 'react';
import { __ } from '@wordpress/i18n';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import {
	MediaUploadCheck,
	MediaUpload,
	MediaPlaceholder,
	BlockIcon,
} from '@wordpress/block-editor';

/**
 * Handle image upload
 * @param {*} param0
 * @returns
 */
export default function EditorImageUploader({
	attributes,
	setAttributes,
	componentTitle = 'Upload Image',
	imageIdAttribute,
	imageUrlAttribute,
	editorPreviewUrlAttribute,
}) {
	/**
	 * Preview image after image upload
	 */
	const mediaPreviewHandle = attributes[editorPreviewUrlAttribute] && (
		<img
			class="inline-block w-full shadow-md hover:shadow-lg transition-all rounded"
			src={attributes[editorPreviewUrlAttribute]}
		/>
	);
	/**
	 * Remove Image
	 */
	const removeImage = () => {
		setAttributes({
			[imageIdAttribute]: null,
			[imageUrlAttribute]: '',
			[editorPreviewUrlAttribute]: '',
		});
	};
	return (
		/**
		 * Resource link
		 * https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/media-upload/README.md
		 * https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/media-placeholder/README.md
		 */
		<MediaUploadCheck>
			<MediaUpload
				render={() => (
					<div class="relative">
						{attributes[imageIdAttribute] && (
							<div className="remove-image-button absolute right-4 top-5 z-10 ">
								<button
									class="components-button is-primary"
									onClick={removeImage}
								>
									Remove
								</button>
							</div>
						)}
						<MediaPlaceholder
							onSelect={(el) => {
								setAttributes({
									[imageUrlAttribute]: el.url,
									[editorPreviewUrlAttribute]:
										el.sizes.medium.url,
									[imageIdAttribute]: el.id,
								});
							}}
							multiple={false}
							accept="image/*"
							icon={<BlockIcon icon="format-image" />}
							allowedTypes={['image']}
							labels={{ title: componentTitle }}
							mediaPreview={mediaPreviewHandle}
						/>
					</div>
				)}
			/>
		</MediaUploadCheck>
	);
}
