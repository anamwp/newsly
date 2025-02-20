import React from 'react';
import { __ } from '@wordpress/i18n';
import { useState, useRef } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import TypographyControl from '../components/TypographyControl';
// import TabPanelForTextAndLink from '../components/TabPanelForTextAndLink';
import {
	Panel,
	PanelBody,
	SelectControl,
	ToggleControl,
	Button,
	CheckboxControl,
	ClipboardButton,
	__experimentalBoxControl as BoxControl,
	__experimentalBorderControl as BorderControl,
	__experimentalBorderBoxControl as BorderBoxControl,
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
import GSPaddingControl from '../components/GSPaddingControl';

export default function sidebarControl({ props }) {
	const { attributes, setAttributes } = props;
	const [hasFixedBackground, setHasFixedBackground] = useState(false);
	const [hasFixedBg, setHasFixedBg] = useState(false);
	const [color, setColor] = useState();
	const [date, setDate] = useState(new Date());

	const onSelect = (tabName) => {
		console.log('Selecting tab', tabName);
	};

	return (
		<div>
			<InspectorControls>
				{/* settings: Column */}
				<Panel>
					<PanelBody
						icon="welcome-widgets-menus"
						initialOpen={true}
						title="Block Structure"
					>
						<SelectControl
							label="Choose Column"
							value={attributes.movieColumn}
							options={[
								{ label: 'Column 2', value: 2 },
								{ label: 'Column 3', value: 3 },
								{ label: 'Column 4', value: 4 },
							]}
							onChange={(newSize) => {
								setAttributes({ movieColumn: +newSize });
							}}
						/>
					</PanelBody>
				</Panel>
				{/* settings: Meta data */}
				<Panel>
					<PanelBody
						icon="welcome-widgets-menus"
						initialOpen={true}
						title="Meta Information"
					>
						{/* Genre */}
						<CheckboxControl
							label="Genre"
							help="Show genre of the movie in the card."
							checked={attributes.showGenre}
							onChange={(newValue) => {
								setAttributes({ showGenre: newValue });
							}}
						/>
						{/* Language */}
						<CheckboxControl
							label="Language"
							help="Show Language of the movie in the card."
							checked={attributes.showLanguage}
							onChange={(newValue) => {
								setAttributes({ showLanguage: newValue });
							}}
						/>
						{/* Release Date */}
						<CheckboxControl
							label="Release Date"
							help="Show release date of the movie in the card."
							checked={attributes.showReleaseDate}
							onChange={(newValue) => {
								setAttributes({ showReleaseDate: newValue });
							}}
						/>
						{/* Vote Count */}
						<CheckboxControl
							label="Vote Count"
							help="Show vote count of the movie in the card."
							checked={attributes.showVoteCount}
							onChange={(newValue) => {
								setAttributes({ showVoteCount: newValue });
							}}
						/>
						{/* Vote Average */}
						<CheckboxControl
							label="Vote Average"
							help="Show vote average of the movie in the card."
							checked={attributes.showVoteAverage}
							onChange={(newValue) => {
								setAttributes({ showVoteAverage: newValue });
							}}
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>

			{/* Style panel */}
			<InspectorControls group="styles">
				<Panel>
					<PanelBody initialOpen={true} title="Title">
						<GSPaddingControl
							attributes={attributes}
							setAttributes={setAttributes}
							paddingAttr="titlePaddingAttr"
						/>
						<Spacer
							style={{ border: 'solid 1px #f0f0f0' }}
							margin="10px 0px"
						/>
						<TypographyControl
							attributes={attributes}
							setAttributes={setAttributes}
							textFontWeightAttr="titleFontWeight"
							textFontSizeAttr="titleFontSize"
							textLetterSpacingAttr="titleLetterSpacing"
							textLineHeightAttr="titleLineHeight"
							textStyleAttr="titleStyle"
							textDecorationAttr="titleDecoration"
							textTransformAttr="titleTransform"
						/>
					</PanelBody>
				</Panel>
				<Panel>
					<PanelBody initialOpen={true} title="Content">
						<GSPaddingControl
							attributes={attributes}
							setAttributes={setAttributes}
							paddingAttr="contentPaddingAttr"
						/>
						<Spacer
							style={{ border: 'solid 1px #f0f0f0' }}
							margin="10px 0px"
						/>
						<TypographyControl
							attributes={attributes}
							setAttributes={setAttributes}
							textFontWeightAttr="titleFontWeight"
							textFontSizeAttr="titleFontSize"
							textLetterSpacingAttr="titleLetterSpacing"
							textLineHeightAttr="titleLineHeight"
							textStyleAttr="titleStyle"
							textDecorationAttr="titleDecoration"
							textTransformAttr="titleTransform"
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>
		</div>
	);
}
