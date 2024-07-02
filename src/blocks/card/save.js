import React from 'react';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes, props }) {
	const blockProps = useBlockProps.save({
		className: 'gts__card',
	});
	console.log('save attributes', attributes);
	return (
		<div {...blockProps}>
			<div className="card">
				{attributes.imageId && (
					<div className="card__img">
						<img
							className={
								'achievement-image wp-image-' +
								attributes.imageId
							}
							src={attributes.imageUrl}
							width={900}
							height={600}
							// alt={attributes.mediaAlt}
						/>
					</div>
				)}
				<div className="card__content">
					<div className="card__content__title">
						<RichText.Content
							tagName="h2"
							value={attributes.title}
							style={{
								fontSize: attributes.titleFontSize + 'px',
							}}
						/>
					</div>
					<div className="card__content__description">
						<RichText.Content
							tagName="p"
							value={attributes.content}
							style={{
								fontSize: attributes.contentFontSize + 'px',
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
