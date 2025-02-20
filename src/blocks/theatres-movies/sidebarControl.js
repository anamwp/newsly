import React from 'react';
import { __ } from '@wordpress/i18n';
import { useSelect, withSelect, select } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	Panel,
	PanelBody,
	PanelRow,
	SelectControl,
	CheckboxControl,
	ClipboardButton,
	GradientPicker,
	__experimentalBoxControl as BoxControl,
	__experimentalBorderControl as BorderControl,
	__experimentalBorderBoxControl as BorderBoxControl,
} from '@wordpress/components';

import HandleMovieUpdate from '../components/HandleMovieUpdate';

export default function sidebarControl({ props, handleMovieUpdateForView }) {
	const { attributes, setAttributes } = props;

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
