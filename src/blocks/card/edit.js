import { __ } from '@wordpress/i18n';
import React from 'react';
import {
	Button,
	ResponsiveWrapper,
	PanelBody,
	ButtonGroup,
	FormFileUpload,
} from '@wordpress/components';
import { closeSmall, image as icon } from '@wordpress/icons';
import { isBlobURL } from '@wordpress/blob';
import {
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
	InspectorControls,
	ColorPalette,
	AlignmentToolbar,
	BlockIcon,
	RichText,
	MediaPlaceholder,
	InnerBlocks,
} from '@wordpress/block-editor';
import classnames from 'classnames';
import SidebarControl from './sidebarControl';
/**
 * Internal dependencies
 * Template to insert core blocks
 */
const CARD_FOOTER_TEMPLATE = [
	[
		'core/button',
		{
			text: 'Read More',
			placeholder: 'Book Your Demo',
			customClass: 'inline-block mt-6',
		},
	],
];
/**
 * File upload component
 * @param {*} Attributes
 * @returns
 */
const MyFormFileUpload = ({ attributes, setAttributes }) => {
	const mediaPreviewHandle = !!attributes.editorPreviewUrl && (
		<img
			class="inline-block w-full shadow-md hover:shadow-lg transition-all rounded"
			src={attributes.editorPreviewUrl}
		/>
	);
	return (
		<MediaUpload
			render={() => (
				<>
					<MediaPlaceholder
						onSelect={(el) => {
							setAttributes({
								imageUrl: el.url,
								editorPreviewUrl: el.sizes.medium.url,
								imageId: el.id,
							});
						}}
						multiple={false}
						accept="image/*"
						// icon={<BlockIcon icon="format-image" />}
						allowedTypes={['image']}
						labels={{ title: 'Card Image' }}
						mediaPreview={mediaPreviewHandle}
					/>
				</>
			)}
		/>
	);
};
/**
 * Edit component
 * @param {*} props
 * @returns
 */
export default function edit(props) {
	/**
	 * Destructuring props
	 */
	const { attributes, setAttributes, className, isSelected } = props;
	/**
	 * Set classname
	 */
	const blockProps = useBlockProps({
		className: 'gts__card',
	});
	return (
		<div {...blockProps}>
			{/* Sidebar Control */}
			<SidebarControl props={props} />

			{/* Editor panel content */}
			<div className="card shadow-md hover:shadow-lg rounded border-solid border-black-400 border-2 p-8">
				{/* Image */}
				<div className="card__img rounded">
					<MyFormFileUpload
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</div>
				{/* card content */}
				<div className="card__content">
					{/* title */}
					<div className="card__content__title">
						<RichText
							tagName="h2"
							className="mt-8 mb-3 font-poppins text-2xl text-slate-700 font-medium"
							value={attributes.title}
							style={{
								fontSize: attributes.titleFontSize + 'px',
							}}
							// allowedFormats={['core/bold', 'core/italic']}
							onChange={(title) => setAttributes({ title })}
							multiline={false}
							placeholder={__('Heading...')}
						/>
					</div>
					{/* content */}
					<div className="card__content__description font-roboto">
						<RichText
							tagName="p"
							value={attributes.content}
							className="text-slate-600"
							style={{
								fontSize: attributes.contentFontSize + 'px',
							}}
							// allowedFormats={['core/bold', 'core/italic']}
							onChange={(content) => setAttributes({ content })}
						/>
					</div>
					{/* footer */}
					<div className="card__footer mt-5">
						<InnerBlocks
							template={CARD_FOOTER_TEMPLATE}
							templateLock="all"
							allowedBlocks={['core/button']}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
