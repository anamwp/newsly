/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SidebarControl from './sidebarControl';

jest.mock('@wordpress/block-editor', () => ({
	InspectorControls: ({ children }) => (
		<div data-testid="inspector-controls">{children}</div>
	),
}));

jest.mock('@wordpress/components', () => {
	const React = require('react');
	return {
		PanelBody: ({ children, title }) =>
			React.createElement(
				'div',
				{ 'data-testid': 'panel-body', 'data-title': title },
				children,
			),
		SelectControl: ({ label, value, options, onChange, multiple }) =>
			React.createElement('span', { 'data-testid': 'select-control' }, [
				React.createElement('label', { key: 'label' }, label),
				React.createElement(
					'select',
					{
						key: 'select',
						'data-testid': `select-input-${label}`,
						multiple: !!multiple,
						value,
						onChange: (e) => {
							if (!onChange) return;
							if (multiple) {
								const selected = Array.from(
									e.target.selectedOptions,
								).map((opt) => opt.value);
								onChange(selected);
							} else {
								onChange(e.target.value);
							}
						},
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
		RangeControl: ({ label, value, onChange, min, max }) =>
			React.createElement('span', { 'data-testid': 'range-control' }, [
				React.createElement('label', { key: 'label' }, label),
				React.createElement('input', {
					key: 'input',
					'data-testid': `range-input-${label}`,
					type: 'range',
					value,
					min,
					max,
					onChange: (e) =>
						onChange && onChange(parseInt(e.target.value, 10)),
				}),
			]),
		ToggleControl: ({ label, checked, onChange }) =>
			React.createElement(
				'span',
				{ 'data-testid': 'toggle-control', 'data-label': label },
				[
					React.createElement('label', { key: 'label' }, label),
					React.createElement('input', {
						key: 'input',
						'data-testid': `toggle-${label
							.toLowerCase()
							.replace(/\s+/g, '-')}`,
						type: 'checkbox',
						checked,
						onChange: (e) => onChange && onChange(e.target.checked),
					}),
				],
			),
	};
});

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));

describe('Category Post SidebarControl', () => {
	const categories = [
		{ label: 'Tech', value: '1' },
		{ label: 'News', value: '2' },
	];

	const baseProps = {
		props: {
			attributes: {
				selectedCategroyId: [],
				selectedCategories: [],
				postsToShow: 3,
				postColumn: 3,
				layout: 'card',
				showFeaturedImage: true,
				showCategory: true,
				showExcerpt: true,
				showFeaturedExcerpt: true,
			},
			setAttributes: jest.fn(),
		},
		categories,
		handleCategoryChange: jest.fn(),
		handleNumberofPoststoShow: jest.fn(),
		handleNumberofPostsColumn: jest.fn(),
		handleCategoryToggleControl: jest.fn(),
		handleExcerptToggleControl: jest.fn(),
		handleFeaturedExcerptToggleControl: jest.fn(),
		handleFeaturedImageToggleControl: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('renders the category picker', () => {
		render(<SidebarControl {...baseProps} />);
		expect(
			screen.getByTestId('select-input-Choose Categories'),
		).toBeInTheDocument();
	});

	test('does not show the loading message by default', () => {
		render(<SidebarControl {...baseProps} />);
		expect(screen.queryByText('Loading posts…')).not.toBeInTheDocument();
	});

	test('shows the loading message above the category picker when isFetchingPosts is true', () => {
		render(<SidebarControl {...baseProps} isFetchingPosts={true} />);

		expect(screen.getByText('Loading posts…')).toBeInTheDocument();
		expect(screen.getByRole('status')).toHaveTextContent('Loading posts…');
	});

	test('hides the loading message when isFetchingPosts is false', () => {
		render(<SidebarControl {...baseProps} isFetchingPosts={false} />);
		expect(screen.queryByText('Loading posts…')).not.toBeInTheDocument();
	});

	test('calls handleCategoryChange with the selected category ids', () => {
		render(<SidebarControl {...baseProps} />);

		const select = screen.getByTestId('select-input-Choose Categories');
		select.querySelector('option[value="1"]').selected = true;
		fireEvent.change(select);

		expect(baseProps.handleCategoryChange).toHaveBeenCalledWith(['1']);
	});

	test('does not show the posts-to-show range control until a category is selected', () => {
		render(<SidebarControl {...baseProps} />);
		expect(
			screen.queryByTestId('range-input-Posts to show'),
		).not.toBeInTheDocument();
	});

	test('shows the posts-to-show range control once categories are selected', () => {
		const propsWithSelection = {
			...baseProps,
			props: {
				...baseProps.props,
				attributes: {
					...baseProps.props.attributes,
					selectedCategroyId: ['1'],
					selectedCategories: [{ id: 1, label: 'Tech' }],
				},
			},
		};

		render(<SidebarControl {...propsWithSelection} />);

		fireEvent.change(
			screen.getByTestId('range-input-Posts to show'),
			{ target: { value: '5' } },
		);
		expect(baseProps.handleNumberofPoststoShow).toHaveBeenCalledWith(5);

		fireEvent.click(screen.getByTestId('toggle-show-featured-image'));
		expect(baseProps.handleFeaturedImageToggleControl).toHaveBeenCalled();

		fireEvent.click(screen.getByTestId('toggle-show-category'));
		expect(baseProps.handleCategoryToggleControl).toHaveBeenCalled();
	});

	test('shows the excerpt toggle for the card layout and the featured-excerpt toggle for the grid layout', () => {
		const cardProps = {
			...baseProps,
			props: {
				...baseProps.props,
				attributes: {
					...baseProps.props.attributes,
					selectedCategroyId: ['1'],
					layout: 'card',
				},
			},
		};
		const { unmount } = render(<SidebarControl {...cardProps} />);
		fireEvent.click(screen.getByTestId('toggle-show-excerpt'));
		expect(baseProps.handleExcerptToggleControl).toHaveBeenCalled();
		unmount();

		const gridProps = {
			...baseProps,
			props: {
				...baseProps.props,
				attributes: {
					...baseProps.props.attributes,
					selectedCategroyId: ['1'],
					layout: 'grid',
				},
			},
		};
		render(<SidebarControl {...gridProps} />);
		fireEvent.click(
			screen.getByTestId('toggle-show-featured-post-excerpt'),
		);
		expect(baseProps.handleFeaturedExcerptToggleControl).toHaveBeenCalled();
	});

	test('shows the post-column range control and layout picker once categories are selected with 3 or 4 columns', () => {
		const propsWithSelection = {
			...baseProps,
			props: {
				...baseProps.props,
				attributes: {
					...baseProps.props.attributes,
					selectedCategories: [{ id: 1, label: 'Tech' }],
					postColumn: 3,
				},
			},
		};

		render(<SidebarControl {...propsWithSelection} />);

		fireEvent.change(screen.getByTestId('range-input-Post Column'), {
			target: { value: '4' },
		});
		expect(baseProps.handleNumberofPostsColumn).toHaveBeenCalledWith(4);

		fireEvent.change(
			screen.getByTestId('select-input-Select Layout'),
			{ target: { value: 'grid' } },
		);
		expect(baseProps.props.setAttributes).toHaveBeenCalledWith({
			layout: 'grid',
		});
	});

	test('hides the layout picker for post columns outside 3-4', () => {
		const propsWithTwoColumns = {
			...baseProps,
			props: {
				...baseProps.props,
				attributes: {
					...baseProps.props.attributes,
					selectedCategories: [{ id: 1, label: 'Tech' }],
					postColumn: 2,
				},
			},
		};

		render(<SidebarControl {...propsWithTwoColumns} />);
		expect(
			screen.queryByTestId('select-input-Select Layout'),
		).not.toBeInTheDocument();
	});

	test('defaults the posts-to-show range control to 4 when postsToShow is not set', () => {
		const propsWithoutPostsToShow = {
			...baseProps,
			props: {
				...baseProps.props,
				attributes: {
					...baseProps.props.attributes,
					selectedCategroyId: ['1'],
					postsToShow: undefined,
				},
			},
		};

		render(<SidebarControl {...propsWithoutPostsToShow} />);
		expect(
			screen.getByTestId('range-input-Posts to show'),
		).toHaveValue('4');
	});

	test('defaults the post-column range control to 4 when postColumn is not set', () => {
		const propsWithoutPostColumn = {
			...baseProps,
			props: {
				...baseProps.props,
				attributes: {
					...baseProps.props.attributes,
					selectedCategories: [{ id: 1, label: 'Tech' }],
					postColumn: undefined,
				},
			},
		};

		render(<SidebarControl {...propsWithoutPostColumn} />);
		expect(
			screen.getByTestId('range-input-Post Column'),
		).toHaveValue('4');
	});
});
