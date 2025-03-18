import { __ } from '@wordpress/i18n';
import React from 'react';
import {
	Button,
	ResponsiveWrapper,
	PanelBody,
	ButtonGroup,
	FormFileUpload,
} from '@wordpress/components';
import { closeSmall, color, image as icon } from '@wordpress/icons';
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
import SidebarControl from './sidebarControl';
import EditorImageUploader from '../components/EditorImageUploader';
import { useEffect } from '@wordpress/element';
/**
 * External dependencies
 * Importing useInstanceId from @wordpress/compose
 * This Provides a unique instance ID.
 * Doc Link: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-compose/#useinstanceid
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 * Template to insert core blocks
 */
const GTS_CARD_FOOTER_TEMPLATE = [
	[
		'core/button',
		{
			text: __('Read More', 'gutenbergp-starter'),
			placeholder: __('Add your button text', 'gutenbergp-starter'),
			customClass: 'inline-block mt-6',
		},
	],
];

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

	const { blockId } = attributes;
	const instanceId = useInstanceId(edit);

	useEffect(() => {
		/**
		 * Set block id
		 */
		setAttributes({
			blockId: instanceId,
		});
	}, [blockId, instanceId]);

	/**
	 * Set classname
	 */
	const blockProps = useBlockProps({
		className: `gts__card gts__card__${attributes.blockId}`,
	});
	return (
		<div
			{...blockProps}
			style={{
				textAlign: attributes.blockAlignContent,
			}}
		>
			{/* 
			Style
			Link: https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/block-styles/
			This inline style is added to maintain individual block style to avoid conflicts with other card blocks
			 */}

			<style>{`.gts__card__${attributes.blockId} .card__content__title h2 a {color: ${attributes.linkColor};} .gts__card__${attributes.blockId} .card__content__title h2 a:hover {color: ${attributes.linkHoverColor};} .gts__card__${attributes.blockId} .card__content__description a{color: ${attributes.contentLinkColor}} .gts__card__${attributes.blockId} .card__content__description a:hover{color: ${attributes.contentLinkHoverColor}}`}</style>

			{/* Sidebar Control */}
			<SidebarControl props={props} />

			{/* Editor panel content */}
			<div className="card shadow-md hover:shadow-lg rounded border-solid border-black-400 border-2 p-8">
				{/* Image */}
				{attributes.showImage && (
					<div className="card__img rounded">
						{/* 
					Template for image uploader
					attribute name needs to be passed as props for image uploader
					*/}
						<EditorImageUploader
							attributes={attributes}
							setAttributes={setAttributes}
							componentTitle="Card Image"
							imageIdAttribute="imageId"
							imageUrlAttribute="imageUrl"
							editorPreviewUrlAttribute="editorPreviewUrl"
						/>
					</div>
				)}
				{/* card content */}
				<div className="card__content">
					{/* title */}
					<div className="card__content__title">
						{/* Link: https://developer.wordpress.org/block-editor/reference-guides/richtext/ */}
						<RichText
							tagName="h2"
							className="mt-8 mb-3 font-poppins text-2xl text-slate-700 font-medium"
							value={attributes.title}
							style={{
								fontSize: attributes.titleFontSize + 'px',
								color: attributes.headingColor,
							}}
							onChange={(title) => setAttributes({ title })}
							multiline={false}
							placeholder={__('Heading...', 'gutenbergp-starter')}
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
								color: attributes.contentColor,
							}}
							onChange={(content) => setAttributes({ content })}
						/>
					</div>
					{/* footer */}
					<div className="card__footer mt-5 inline-block">
						{/* Link: https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/nested-blocks-inner-blocks/ */}
						<InnerBlocks
							template={GTS_CARD_FOOTER_TEMPLATE}
							templateLock="all"
							allowedBlocks={['core/button']}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
