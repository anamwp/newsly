/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SidebarControl from './sidebarControl';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
	InspectorControls: ({ children }) => (
		<div data-testid="inspector-controls">{children}</div>
	),
}));

jest.mock('@wordpress/components', () => {
	const React = require('react');
	return {
		PanelBody: ({ children, title, initialOpen }) =>
			React.createElement(
				'div',
				{
					'data-testid': 'panel-body',
					'data-title': title,
					'data-initial-open': initialOpen,
				},
				children,
			),
		SelectControl: ({ label, value, options, onChange }) =>
			React.createElement('div', { 'data-testid': 'select-control' }, [
				React.createElement('label', { key: 'label' }, label),
				React.createElement(
					'select',
					{
						key: 'select',
						'data-testid': 'select-input',
						value: value,
						onChange: (e) => onChange && onChange(e.target.value),
					},
					options
						? options.map((opt) =>
								React.createElement(
									'option',
									{ key: opt.value, value: opt.value },
									opt.label,
								),
						  )
						: [],
				),
			]),
		RangeControl: ({ label, value, onChange, min, max, step }) =>
			React.createElement('div', { 'data-testid': 'range-control' }, [
				React.createElement('label', { key: 'label' }, label),
				React.createElement('input', {
					key: 'input',
					'data-testid': 'range-input',
					type: 'range',
					value: value,
					min: min,
					max: max,
					step: step,
					onChange: (e) =>
						onChange && onChange(parseInt(e.target.value)),
				}),
			]),
		ToggleControl: ({ label, checked, onChange }) =>
			React.createElement(
				'div',
				{ 'data-testid': 'toggle-control', 'data-label': label },
				[
					React.createElement('label', { key: 'label' }, label),
					React.createElement('input', {
						key: 'input',
						'data-testid': `toggle-${label
							.toLowerCase()
							.replace(/\s+/g, '-')}`,
						type: 'checkbox',
						checked: checked,
						onChange: (e) => onChange && onChange(e.target.checked),
					}),
				],
			),
	};
});

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));

jest.mock('@wordpress/data', () => ({
	useSelect: jest.fn(() => ({})),
	withSelect: jest.fn((selector) => (Component) => Component),
	select: jest.fn(() => ({})),
}));

jest.mock('@wordpress/element', () => ({
	RawHTML: ({ children }) => <div>{children}</div>,
	useState: jest.requireActual('react').useState,
	useRef: jest.requireActual('react').useRef,
	useEffect: jest.requireActual('react').useEffect,
}));

describe('SidebarControl Component', () => {
	const mockHandlers = {
		handleNumberOfPostsChange: jest.fn(),
		handleCategoryChange: jest.fn(),
		handleCategoryToggleControl: jest.fn(),
		handleExcerptToggleControl: jest.fn(),
		handleFeaturedImageToggleControl: jest.fn(),
	};

	const mockCategories = [
		{ label: 'Select a category', value: '' },
		{ label: 'Technology', value: '1' },
		{ label: 'Sports', value: '2' },
		{ label: 'News', value: '3' },
	];

	const mockProps = {
		attributes: {
			selectedCategroyId: '',
			numberOfPosts: 5,
			showCategory: true,
			showExcerpt: true,
			showFeaturedImage: true,
		},
		setAttributes: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Component Rendering', () => {
		test('renders without crashing', () => {
			// Suppress expected DOM nesting warning (div inside p)
			const consoleSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			expect(
				screen.getByTestId('inspector-controls'),
			).toBeInTheDocument();

			consoleSpy.mockRestore();
		});

		test('renders PanelBody with correct title', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const panelBody = screen.getByTestId('panel-body');
			expect(panelBody).toHaveAttribute(
				'data-title',
				'Featured Posts Controls',
			);
		});

		test('renders PanelBody with initialOpen set to true', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const panelBody = screen.getByTestId('panel-body');
			expect(panelBody).toHaveAttribute('data-initial-open', 'true');
		});

		test('renders SelectControl for category selection', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			expect(screen.getByText('Choose Category')).toBeInTheDocument();
			expect(screen.getByTestId('select-input')).toBeInTheDocument();
		});

		test('renders RangeControl for number of posts', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			expect(screen.getByText('Number of Posts')).toBeInTheDocument();
			expect(screen.getByTestId('range-input')).toBeInTheDocument();
		});
	});

	describe('SelectControl', () => {
		test('displays current selected category value', () => {
			const propsWithCategory = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					selectedCategroyId: '1',
				},
			};
			render(
				<SidebarControl
					props={propsWithCategory}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const select = screen.getByTestId('select-input');
			expect(select).toHaveValue('1');
		});

		test('renders all category options', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const options = screen.getAllByRole('option');
			expect(options).toHaveLength(4);
			expect(options[0]).toHaveTextContent('Select a category');
			expect(options[1]).toHaveTextContent('Technology');
			expect(options[2]).toHaveTextContent('Sports');
			expect(options[3]).toHaveTextContent('News');
		});

		test('calls handleCategoryChange when category is changed', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const select = screen.getByTestId('select-input');
			fireEvent.change(select, { target: { value: '2' } });
			expect(mockHandlers.handleCategoryChange).toHaveBeenCalledWith('2');
		});
	});

	describe('RangeControl', () => {
		test('displays current numberOfPosts value', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const rangeInput = screen.getByTestId('range-input');
			expect(rangeInput).toHaveValue('5');
		});

		test('has correct min, max, and step attributes', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const rangeInput = screen.getByTestId('range-input');
			expect(rangeInput).toHaveAttribute('min', '1');
			expect(rangeInput).toHaveAttribute('max', '10');
			expect(rangeInput).toHaveAttribute('step', '1');
		});

		test('calls handleNumberOfPostsChange when value is changed', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const rangeInput = screen.getByTestId('range-input');
			fireEvent.change(rangeInput, { target: { value: '7' } });
			expect(mockHandlers.handleNumberOfPostsChange).toHaveBeenCalledWith(
				7,
			);
		});

		test('converts string value to number when calling handler', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const rangeInput = screen.getByTestId('range-input');
			fireEvent.change(rangeInput, { target: { value: '3' } });
			expect(mockHandlers.handleNumberOfPostsChange).toHaveBeenCalledWith(
				3,
			);
			expect(
				mockHandlers.handleNumberOfPostsChange,
			).not.toHaveBeenCalledWith('3');
		});
	});

	describe('Conditional ToggleControls', () => {
		test('does not render toggle controls when no category is selected', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			expect(
				screen.queryByText('Show Featured Image'),
			).not.toBeInTheDocument();
			expect(screen.queryByText('Show Category')).not.toBeInTheDocument();
			expect(screen.queryByText('Show Excerpt')).not.toBeInTheDocument();
		});

		test('renders all toggle controls when category is selected', () => {
			const propsWithCategory = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					selectedCategroyId: '1',
				},
			};
			render(
				<SidebarControl
					props={propsWithCategory}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			expect(screen.getByText('Show Featured Image')).toBeInTheDocument();
			expect(screen.getByText('Show Category')).toBeInTheDocument();
			expect(screen.getByText('Show Excerpt')).toBeInTheDocument();
		});
	});

	describe('Show Featured Image Toggle', () => {
		const propsWithCategory = {
			...mockProps,
			attributes: {
				...mockProps.attributes,
				selectedCategroyId: '1',
			},
		};

		test('displays correct checked state', () => {
			render(
				<SidebarControl
					props={propsWithCategory}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const toggle = screen.getByTestId('toggle-show-featured-image');
			expect(toggle).toBeChecked();
		});

		test('calls handleFeaturedImageToggleControl when toggled', () => {
			render(
				<SidebarControl
					props={propsWithCategory}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const toggle = screen.getByTestId('toggle-show-featured-image');
			fireEvent.click(toggle);
			expect(
				mockHandlers.handleFeaturedImageToggleControl,
			).toHaveBeenCalledWith(false);
		});
	});

	describe('Show Category Toggle', () => {
		const propsWithCategory = {
			...mockProps,
			attributes: {
				...mockProps.attributes,
				selectedCategroyId: '1',
			},
		};

		test('displays correct checked state', () => {
			render(
				<SidebarControl
					props={propsWithCategory}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const toggle = screen.getByTestId('toggle-show-category');
			expect(toggle).toBeChecked();
		});

		test('calls handleCategoryToggleControl when toggled', () => {
			render(
				<SidebarControl
					props={propsWithCategory}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const toggle = screen.getByTestId('toggle-show-category');
			fireEvent.click(toggle);
			expect(
				mockHandlers.handleCategoryToggleControl,
			).toHaveBeenCalledWith(false);
		});

		test('handles unchecked state correctly', () => {
			const propsUnchecked = {
				...propsWithCategory,
				attributes: {
					...propsWithCategory.attributes,
					showCategory: false,
				},
			};
			render(
				<SidebarControl
					props={propsUnchecked}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const toggle = screen.getByTestId('toggle-show-category');
			expect(toggle).not.toBeChecked();
		});
	});

	describe('Show Excerpt Toggle', () => {
		const propsWithCategory = {
			...mockProps,
			attributes: {
				...mockProps.attributes,
				selectedCategroyId: '1',
			},
		};

		test('displays correct checked state', () => {
			render(
				<SidebarControl
					props={propsWithCategory}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const toggle = screen.getByTestId('toggle-show-excerpt');
			expect(toggle).toBeChecked();
		});

		test('calls handleExcerptToggleControl when toggled', () => {
			render(
				<SidebarControl
					props={propsWithCategory}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const toggle = screen.getByTestId('toggle-show-excerpt');
			fireEvent.click(toggle);
			expect(
				mockHandlers.handleExcerptToggleControl,
			).toHaveBeenCalledWith(false);
		});

		test('handles unchecked state correctly', () => {
			const propsUnchecked = {
				...propsWithCategory,
				attributes: {
					...propsWithCategory.attributes,
					showExcerpt: false,
				},
			};
			render(
				<SidebarControl
					props={propsUnchecked}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			const toggle = screen.getByTestId('toggle-show-excerpt');
			expect(toggle).not.toBeChecked();
		});
	});

	describe('Edge Cases', () => {
		test('handles empty categories array', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={[]}
					{...mockHandlers}
				/>,
			);
			const select = screen.getByTestId('select-input');
			const options = select.querySelectorAll('option');
			expect(options).toHaveLength(0);
		});

		test('handles undefined categories', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={undefined}
					{...mockHandlers}
				/>,
			);
			expect(screen.getByTestId('select-control')).toBeInTheDocument();
		});

		test('all toggles work independently', () => {
			const propsWithCategory = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					selectedCategroyId: '1',
					showCategory: true,
					showExcerpt: false,
					showFeaturedImage: true,
				},
			};
			render(
				<SidebarControl
					props={propsWithCategory}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);

			expect(screen.getByTestId('toggle-show-category')).toBeChecked();
			expect(screen.getByTestId('toggle-show-excerpt')).not.toBeChecked();
			expect(
				screen.getByTestId('toggle-show-featured-image'),
			).toBeChecked();
		});
	});

	describe('Accessibility', () => {
		test('SelectControl has label', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			expect(screen.getByText('Choose Category')).toBeInTheDocument();
		});

		test('RangeControl has label', () => {
			render(
				<SidebarControl
					props={mockProps}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			expect(screen.getByText('Number of Posts')).toBeInTheDocument();
		});

		test('all ToggleControls have labels when visible', () => {
			const propsWithCategory = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					selectedCategroyId: '1',
				},
			};
			render(
				<SidebarControl
					props={propsWithCategory}
					categories={mockCategories}
					{...mockHandlers}
				/>,
			);
			expect(screen.getByText('Show Featured Image')).toBeInTheDocument();
			expect(screen.getByText('Show Category')).toBeInTheDocument();
			expect(screen.getByText('Show Excerpt')).toBeInTheDocument();
		});
	});
});
