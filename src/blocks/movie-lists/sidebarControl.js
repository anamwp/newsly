import { __ } from '@wordpress/i18n';
import { useSelect, withSelect, select } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	Panel,
	PanelBody,
	PanelRow,
	SelectControl,
	ToggleControl,
	TabPanel,
	ColorPicker,
	DateTimePicker,
	Button,
	ButtonGroup,
	CheckboxControl,
	ClipboardButton,
	__experimentalBoxControl as BoxControl,
	__experimentalBorderControl as BorderControl,
	__experimentalBorderBoxControl as BorderBoxControl,
} from '@wordpress/components';
import React from 'react';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

export default function sidebarControl({
	props,
	// categories,
	// handleCategoryChange,
	// handleSelectedPostData,
	// handleCategoryToggleControl,
	// handleExcerptToggleControl,
	// handleFeaturedImageToggleControl,
}) {
	const { attributes, setAttributes } = props;
	const [hasFixedBackground, setHasFixedBackground] = useState(false);
	const [hasFixedBg, setHasFixedBg] = useState(false);
	const [color, setColor] = useState();
	const [date, setDate] = useState(new Date());

	const onSelect = (tabName) => {
		console.log('Selecting tab', tabName);
	};

	const MyCustomTabContent = () => {
		return (
			<ToggleControl
				label="Fixed Background"
				help={
					hasFixedBg
						? 'Has fixed background.'
						: 'No fixed background.'
				}
				checked={hasFixedBg}
				onChange={(newValue) => {
					setHasFixedBg(newValue);
				}}
			/>
		);
	};

	// Component: BorderControl
	// Component: BorderBoxControl
	const colors = [{ name: 'Blue 20', color: '#72aee6' }];
	const MyBorderControl = () => {
		const [border, setBorder] = useState();
		return (
			<BorderControl
				colors={colors}
				label={__('Border')}
				onChange={setBorder}
				value={border}
			/>
		);
	};
	const MyBorderBoxControl = () => {
		const defaultBorder = {
			color: '#72aee6',
			style: 'dashed',
			width: '1px',
		};
		const [borders, setBorders] = useState({
			top: defaultBorder,
			right: defaultBorder,
			bottom: defaultBorder,
			left: defaultBorder,
		});
		const onChange = (newBorders) => setBorders(newBorders);

		return (
			<BorderBoxControl
				colors={colors}
				label={__('Borders')}
				onChange={onChange}
				value={borders}
			/>
		);
	};
	// Component: BoxControl
	const MyBoxControl = () => {
		const [values, setValues] = useState({
			top: '50px',
			left: '10%',
			right: '10%',
			bottom: '50px',
		});

		return (
			<BoxControl
				values={values}
				onChange={(nextValues) => setValues(nextValues)}
			/>
		);
	};
	// Component: CheckboxControl
	const MyCheckboxControl = () => {
		const [isChecked, setChecked] = useState(true);
		return (
			<CheckboxControl
				label="Is author"
				help="Is the user a author or not?"
				checked={isChecked}
				onChange={setChecked}
			/>
		);
	};
	// Component: ButtonGroup
	const MyButtonGroup = () => (
		<ButtonGroup>
			<Button variant="primary">Button 1</Button>
			<Button variant="primary">Button 2</Button>
		</ButtonGroup>
	);
	// Component: ClipboardButton
	const MyClipboardButton = () => {
		const [hasCopied, setHasCopied] = useState(false);
		return (
			<ClipboardButton
				variant="primary"
				text="Text to be copied."
				onCopy={() => setHasCopied(true)}
				onFinishCopy={() => setHasCopied(false)}
			>
				{hasCopied ? 'Copied!' : 'Copy Text'}
			</ClipboardButton>
		);
	};

	return (
		<div>
			<InspectorControls>
				{/* Component: TabPanel */}
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
				{/* Component: CheckboxControl */}
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
				{/* Buttongroup */}
				<Panel>
					<PanelBody
						icon="welcome-widgets-menus"
						initialOpen={false}
						title="Button"
					>
						<MyButtonGroup />
					</PanelBody>
				</Panel>

				<Panel>
					<PanelBody
						icon="welcome-widgets-menus"
						initialOpen={false}
						title="Box Control"
					>
						<MyBoxControl />
					</PanelBody>
				</Panel>

				<Panel>
					<PanelBody
						icon="welcome-widgets-menus"
						initialOpen={false}
						title="Border"
					>
						<MyBorderControl />
						<MyBorderBoxControl />
					</PanelBody>
				</Panel>

				<Panel>
					<PanelBody
						icon="welcome-widgets-menus"
						initialOpen={false}
						title="My Block Settings"
					>
						<PanelRow>My Panel Inputs and Labels</PanelRow>
					</PanelBody>
				</Panel>

				<Panel>
					<PanelBody
						title={__('Block Styles', 'anam-gutenberg-starter')}
						initialOpen={false}
					>
						<ColorPicker
							color={color}
							onChange={setColor}
							enableAlpha
							defaultValue="#000"
						/>
						<DateTimePicker
							currentDate={date}
							onChange={(newDate) => setDate(newDate)}
							is12Hour={true}
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>
		</div>
	);
}
