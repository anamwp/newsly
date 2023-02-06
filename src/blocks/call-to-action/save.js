import React from 'react';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save(props) {
	console.log('save props', props);
	const blockProps = useBlockProps.save({
		className: 'call-to-action',
	});
	return (
		<div {...blockProps}>
			{props.attributes.showImage && (
				<div
					className="from-save call-to-action-media-wrapper"
					style={{ textAlign: props.attributes.alignment }}
				>
					{props.attributes.media && (
						<img
							src={props.attributes.mediaUrl}
							alt=""
							style={{
								objectPosition: props.attributes.focalPoint
									? `${
											props.attributes.focalPoint.x * 100
									  }% ${
											props.attributes.focalPoint.y * 100
									  }%`
									: undefined,
							}}
						/>
					)}
				</div>
			)}
			<div className="call-to-action-title">
				<RichText.Content
					style={{ textAlign: props.attributes.alignment }}
					tagName="h3"
					value={props.attributes.title && props.attributes.title}
				/>
			</div>
			<div className="call-to-action-content">
				<RichText.Content
					style={{ textAlign: props.attributes.alignment }}
					tagName="p"
					value={props.attributes.content && props.attributes.content}
				/>
			</div>
			<div
				className="call-to-action-button"
				style={{ textAlign: props.attributes.alignment }}
			>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
