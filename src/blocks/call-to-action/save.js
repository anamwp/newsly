import React from 'react';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const blockProps = useBlockProps.save({
		className: 'gts__call-to-action',
	});

	return (
		<div {...blockProps}>
			{attributes.showImage && (
				<div
					className="call-to-action__media-wrapper"
					style={{ textAlign: attributes.alignment }}
				>
					{/* {attributes.media && (
						<img
							src={attributes.mediaUrl}
							alt=""
							style={{
								objectPosition: attributes.focalPoint
									? `${attributes.focalPoint.x * 100}% ${
											attributes.focalPoint.y * 100
									  }%`
									: undefined,
							}}
						/>
					)} */}
				</div>
			)}
			<div className="call-to-action__title">
				<RichText.Content
					style={{ textAlign: attributes.alignment }}
					tagName="h3"
					value={attributes.title && attributes.title}
				/>
			</div>
			<div className="call-to-action__content">
				<RichText.Content
					style={{ textAlign: attributes.alignment }}
					tagName="p"
					value={attributes.content && attributes.content}
				/>
			</div>
			<div
				className="call-to-action__button"
				style={{ textAlign: attributes.alignment }}
			>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
