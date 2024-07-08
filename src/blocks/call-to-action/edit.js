import { __ } from '@wordpress/i18n';
import React from 'react';
import {
	Button,
	ResponsiveWrapper,
	PanelBody,
	ButtonGroup,
} from '@wordpress/components';
import { closeSmall, image as icon } from '@wordpress/icons';
import SidebarControl from './sidebarControl';
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

export default function edit(props) {
	// debugger;
	console.log('edit props ', props);
	const { attributes, setAttributes, className, isSelected } = props;

	const blockProps = useBlockProps({
		className: 'gts__call-to-action',
	});

	const onSelectImage = (imageObj) => {
		// debugger;
		// console.log('imageObj', imageObj);
		setAttributes({
			media: imageObj,
			mediaId: imageObj.id,
			mediaUrl: imageObj.url,
		});
	};
	const removeImage = () => {
		setAttributes({
			media: null,
			mediaId: 0,
			mediaUrl: '',
		});
	};
	const renderPlaceholderForImage = () => {
		return (
			<div className="call-to-action-image-placeholder-wrapper">
				<MediaPlaceholder
					allowedTypes={['image']}
					multiple={false}
					icon="format-image"
					labels={{
						title: 'The Image',
					}}
					onSelect={(imageEntity) => {
						// debugger;
						// console.log(imageEntity);
						if (isBlobURL(imageEntity?.url)) {
							return;
						}
						setAttributes({
							url: imageEntity?.url,
							alt: imageEntity?.alt,
							media: imageEntity,
							mediaId: imageEntity?.id,
							mediaUrl: imageEntity?.url,
						});
						// console.log('updated attributes ', props.attributes);
						// debugger;
					}}
				/>
			</div>
		);
	};
	const renderImage = () => {
		// console.log('render image', attributes);
		const { focalPoint } = attributes;
		// console.log('focalPoint', focalPoint);
		const classes = classnames('call-to-action-image-wrapper', {
			'is-selected': isSelected,
		});
		return (
			<>
				<div className={classes}>
					<div className="button-group">
						{isSelected && (
							<ButtonGroup className="block-library-gallery-item__inline-menu is-right is-visible">
								<Button
									icon={closeSmall}
									onClick={() => {
										setAttributes({
											media: '',
											mediaUrl: '',
										});
									}}
									label={__(
										'Remove Imagee',
										'anam-gutenberg-starter'
									)}
									disabled={!isSelected}
								/>
							</ButtonGroup>
						)}
					</div>
					<div
						className="call-to-action__media-wrapper"
						style={{ textAlign: props.attributes.alignment }}
					>
						{props.attributes.media && (
							<img
								src={props.attributes.mediaUrl}
								alt=""
								style={{
									objectPosition: focalPoint
										? `${focalPoint.x * 100}% ${
												focalPoint.y * 100
										  }%`
										: undefined,
								}}
							/>
						)}
					</div>
				</div>
			</>
		);
	};
	return (
		<div {...blockProps}>
			<SidebarControl
				data={props}
				onSelectImage={onSelectImage}
				removeImage={removeImage}
				onChangeAlignment={(newAlignment) => {
					setAttributes({
						alignment:
							'undefined' === newAlignment ? none : newAlignment,
					});
				}}
			/>

			{/* <div> */}
			{/* <MediaUploadCheck>
					{!props.attributes.media && (
						<MediaUpload
							onSelect={onSelectImage}
							value={props.attributes.mediaUrl}
							render={({ open }) => (
								<Button onClick={open}>
									{props.attributes.mediaUrl ? (
										<img
											src={props.attributes.mediaUrl}
											alt=""
										/>
									) : (
										<BlockIcon icon={icon} />
									)}
								</Button>
							)}
						/>
					)}
				</MediaUploadCheck> */}

			<div className="call-to-action">
				<div
					className="call-to-action__media-wrapper"
					style={{ textAlign: props.attributes.alignment }}
				>
					{/* {props.attributes.media && (
							<img src={props.attributes.mediaUrl} alt="" />
						)} */}
					{/* {props.attributes.showImage
						? props.attributes.media
							? renderImage()
							: renderPlaceholderForImage()
						: false} */}
				</div>
				<div className="call-to-action__title">
					<RichText
						style={{ textAlign: props.attributes.alignment }}
						tagName="h3"
						onChange={(newTitle) => {
							setAttributes({
								title: newTitle,
							});
						}}
						value={props.attributes.title && props.attributes.title}
					/>
				</div>
				<div className="call-to-action__content">
					<RichText
						style={{ textAlign: props.attributes.alignment }}
						tagName="p"
						onChange={(newContent) => {
							setAttributes({
								content: newContent,
							});
						}}
						value={
							props.attributes.content && props.attributes.content
						}
					/>
				</div>
				<div
					className="call-to-action__button"
					style={{ textAlign: props.attributes.alignment }}
				>
					<InnerBlocks
						template={[
							[
								'core/button',
								{
									placeholder: __(
										'Action Link',
										'anam-gutenberg-starter'
									),
								},
							],
						]}
						allowedBlocks={['core/button']}
						templateInsertUpdatesSelection={true}
						__experimentalCaptureToolbars={true}
					/>
				</div>
			</div>
			{/* </div> */}
		</div>
	);
}
