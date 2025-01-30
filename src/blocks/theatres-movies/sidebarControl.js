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
	GradientPicker,
	__experimentalBoxControl as BoxControl,
	__experimentalBorderControl as BorderControl,
	__experimentalBorderBoxControl as BorderBoxControl,
} from '@wordpress/components';
import React from 'react';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import FetchMovie from '../components/FetchMovie';
import HandleMovieUpdate from '../components/HandleMovieUpdate';

export default function sidebarControl({
	props,
	// categories,
	// handleCategoryChange,
	// handleSelectedPostData,
	// handleCategoryToggleControl,
	// handleExcerptToggleControl,
	// handleFeaturedImageToggleControl,
	handleMovieUpdateForView,
}) {
	const { attributes, setAttributes } = props;
	const [hasFixedBackground, setHasFixedBackground] = useState(false);
	const [hasFixedBg, setHasFixedBg] = useState(false);
	const [color, setColor] = useState();
	const [date, setDate] = useState(new Date());
	const [checkUpdateLoader, setCheckUpdateLoader] = useState(false);
	const [updateAttrLoader, setUpdateAttrLoader] = useState(false);
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [newUpdatedMovie, setNewUpdatedMovie] = useState([]);
	const [checkUpdateMessage, setCheckUpdateMessage] = useState('');

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
	const CardGradientPicker = () => {
		return (
			<GradientPicker
				value={attributes.cardGradient}
				onChange={(currentGradient) =>
					setAttributes({ cardGradient: currentGradient })
				}
				gradients={[
					{
						name: 'Black White',
						gradient:
							'linear-gradient(180deg,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.6) 100%)',
						slug: 'jshine',
					},
					{
						name: 'Moonlit Asteroid',
						gradient:
							'linear-gradient(180deg,#0F202700 0%, #2c5364 100%)',
						slug: 'moonlit-asteroid',
					},
					{
						name: 'Rastafarie',
						gradient:
							'linear-gradient(180deg,#1E960000 0%, #FFF200 0%, #FF0000 100%)',
						slug: 'rastafari',
					},
				]}
			/>
		);
	};
	const handleCheckForMovieUpdate = (
		attributes,
		setAttributes,
		remoteUrl = ''
	) => {
		setCheckUpdateLoader(true);
		let oldTheatreMovies = attributes.fetchedMovies;
		var newTheatreMovies = [];
		var isChanged;
		let url = remoteUrl;
		let updatedDataPromise = FetchMovie(url);
		updatedDataPromise
			.then((res) => {
				newTheatreMovies = res.results;
				/**
				 * Check if the data is changed
				 */
				isChanged =
					JSON.stringify(newTheatreMovies) !==
					JSON.stringify(oldTheatreMovies);
				if (isChanged) {
					setUpdateAvailable(true);
					setCheckUpdateMessage('New movies available');
				} else {
					setUpdateAvailable(false);
					setCheckUpdateMessage('No new movies available');
				}
				setCheckUpdateLoader(false);
				setNewUpdatedMovie(newTheatreMovies);
			})
			.catch((e) => console.log(e));
		/**
		 * Todo:
		 * 1. Fetch the latest movie data from the API
		 * 2. Update the movie data in the block
		 * 3. Show a success message
		 * 4. Show an error message if the update fails
		 * 5. Show a loading spinner while the update is in progress
		 * 6. Show a message if the movie data is already up-to-date
		 * 7. Show a message if the movie data is not available
		 * 8. Show a message if the API request fails
		 * 9. Show a message if the API request is unauthorized
		 * 10. Show a message if the API request is forbidden
		 *
		 */
	};

	const handleMovieUpdate = () => {
		setUpdateAttrLoader(true);
		/**
		 * Update the movie data in the block attribute
		 */
		setAttributes({ fetchedMovies: newUpdatedMovie });
		/**
		 * Update parent component with the new movie data
		 */
		handleMovieUpdateForView(newUpdatedMovie);
		setTimeout(() => {
			setUpdateAttrLoader(false);
		}, 5000);
	};

	return (
		<div>
			<InspectorControls>
				{/* Setting: Update */}
				<Panel>
					<PanelBody initialOpen={true} title="Update">
						<PanelRow>
							<HandleMovieUpdate
								attributes={attributes}
								setAttributes={setAttributes}
								movieAttributeKey="fetchedMovies"
								movieAPIUrl="https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1"
								fnHandleMovieUpdateForView={
									handleMovieUpdateForView
								}
							/>
							{/* <div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '10px',
								}}
							>
								<Button
									onClick={() =>
										handleCheckForMovieUpdate(
											attributes,
											setAttributes,
											'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'
										)
									}
									variant="primary"
								>
									{checkUpdateLoader
										? 'Loading'
										: 'Check for Update'}
								</Button>

								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: '10px',
									}}
								>
									<span
										style={{
											color: updateAvailable
												? 'green'
												: 'black',
										}}
									>
										{checkUpdateMessage}
									</span>
									{updateAvailable && (
										<Button
											variant="secondary"
											onClick={() => {
												handleMovieUpdate();
											}}
										>
											{updateAttrLoader
												? 'Updating'
												: 'Update'}
										</Button>
									)}
								</div>
							</div> */}
						</PanelRow>
					</PanelBody>
				</Panel>
				{/* settings: Column */}
				<Panel>
					<PanelBody
						// icon="welcome-widgets-menus"
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
						// icon="welcome-widgets-menus"
						initialOpen={true}
						title="Meta Information"
					>
						{/* Genre */}
						<CheckboxControl
							label="Description"
							help="Show description of the movie in the card."
							checked={attributes.showDescription}
							onChange={(newValue) => {
								setAttributes({ showDescription: newValue });
							}}
						/>
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
					<PanelBody
						// icon="welcome-widgets-menus"
						initialOpen={true}
						title="Gradient"
					>
						<CardGradientPicker />
					</PanelBody>
				</Panel>
			</InspectorControls>
		</div>
	);
}
