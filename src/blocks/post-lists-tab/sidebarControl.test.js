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
						checked: checked,
						onChange: (e) => onChange && onChange(e.target.checked),
					}),
				],
			),
		SelectControl: () => null,
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

describe('Post Lists Tab - SidebarControl', () => {
	const mockHandlers = {
		handleCategoryToggleControl: jest.fn(),
		handleExcerptToggleControl: jest.fn(),
		handleFeaturedImageToggleControl: jest.fn(),
	};

	const mockProps = {
		attributes: {
			showFeaturedImage: true,
			showCategory: true,
			showExcerpt: true,
		},
		setAttributes: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Rendering', () => {
		test('renders inside InspectorControls', () => {
			render(<SidebarControl props={mockProps} {...mockHandlers} />);
			expect(
				screen.getByTestId('inspector-controls'),
			).toBeInTheDocument();
		});

		test('renders the PanelBody with the expected title, initially open', () => {
			render(<SidebarControl props={mockProps} {...mockHandlers} />);
			const panelBody = screen.getByTestId('panel-body');
			expect(panelBody).toHaveAttribute(
				'data-title',
				'Post Card Controls',
			);
			expect(panelBody).toHaveAttribute('data-initial-open', 'true');
		});

		test('renders all three toggle controls with their labels', () => {
			render(<SidebarControl props={mockProps} {...mockHandlers} />);
			expect(
				screen.getByText('Show Featured Image'),
			).toBeInTheDocument();
			expect(screen.getByText('Show Category')).toBeInTheDocument();
			expect(screen.getByText('Show Excerpt')).toBeInTheDocument();
		});
	});

	describe('Checked state reflects attributes', () => {
		test('shows all toggles checked when attributes are true', () => {
			render(<SidebarControl props={mockProps} {...mockHandlers} />);
			expect(
				screen.getByTestId('toggle-show-featured-image'),
			).toBeChecked();
			expect(screen.getByTestId('toggle-show-category')).toBeChecked();
			expect(screen.getByTestId('toggle-show-excerpt')).toBeChecked();
		});

		test('shows all toggles unchecked when attributes are false', () => {
			const props = {
				...mockProps,
				attributes: {
					showFeaturedImage: false,
					showCategory: false,
					showExcerpt: false,
				},
			};
			render(<SidebarControl props={props} {...mockHandlers} />);
			expect(
				screen.getByTestId('toggle-show-featured-image'),
			).not.toBeChecked();
			expect(
				screen.getByTestId('toggle-show-category'),
			).not.toBeChecked();
			expect(
				screen.getByTestId('toggle-show-excerpt'),
			).not.toBeChecked();
		});
	});

	describe('Handlers', () => {
		test('calls handleFeaturedImageToggleControl when its toggle is clicked', () => {
			render(<SidebarControl props={mockProps} {...mockHandlers} />);
			fireEvent.click(screen.getByTestId('toggle-show-featured-image'));
			expect(
				mockHandlers.handleFeaturedImageToggleControl,
			).toHaveBeenCalledTimes(1);
		});

		test('calls handleCategoryToggleControl when its toggle is clicked', () => {
			render(<SidebarControl props={mockProps} {...mockHandlers} />);
			fireEvent.click(screen.getByTestId('toggle-show-category'));
			expect(
				mockHandlers.handleCategoryToggleControl,
			).toHaveBeenCalledTimes(1);
		});

		test('calls handleExcerptToggleControl when its toggle is clicked', () => {
			render(<SidebarControl props={mockProps} {...mockHandlers} />);
			fireEvent.click(screen.getByTestId('toggle-show-excerpt'));
			expect(
				mockHandlers.handleExcerptToggleControl,
			).toHaveBeenCalledTimes(1);
		});
	});
});
