import React from 'react';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save(props) {
	const blockProps = useBlockProps.save({
		className: 'gts__card',
	});
	// debugger;
	return (
		<div {...blockProps}>
			<div className="">
				{/* <div className="card__img">this is card</div> */}
				<div className="card__title">
					<RichText.Content
						tagName="h2"
						value={props.attributes.title}
					/>
				</div>
				<div className="card__description">
					<RichText.Content
						tagName="p"
						value={props.attributes.content}
					/>
				</div>
			</div>
		</div>
	);
}
