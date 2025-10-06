/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import edit from './edit';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
	useBlockProps: jest.fn(() => ({ className: 'newsly_block__featured_posts' })),
}));

jest.mock('@wordpress/api-fetch', () => ({
	__esModule: true,
	default: jest.fn(() => Promise.resolve([])),
}));

jest.mock('@wordpress/element', () => ({
	useState: jest.requireActual('react').useState,
	useEffect: jest.requireActual('react').useEffect,
	useContext: jest.fn(),
	useRef: jest.fn(),
}));

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));

jest.mock('@wordpress/data', () => ({
	useSelect: jest.fn(() => ({})),
	withSelect: jest.fn((selector) => (Component) => Component),
	select: jest.fn(() => ({})),
	dispatch: jest.fn(() => ({})),
	useDispatch: jest.fn(() => jest.fn()),
}));

jest.mock('@wordpress/components', () => {
	const React = require('react');
	return {
		PanelBody: jest.fn(({ children }) => React.createElement('div', { 'data-testid': 'panel-body' }, children)),
		SelectControl: jest.fn(({ onChange, options }) => 
			React.createElement('select', { 
				'data-testid': 'select-control',
				onChange: (e) => onChange && onChange(e.target.value)
			}, options ? options.map(opt => 
				React.createElement('option', { key: opt.value, value: opt.value }, opt.label)
			) : [])
		),
		ToggleControl: jest.fn(({ onChange, checked }) => 
			React.createElement('input', { 
				'data-testid': 'toggle-control',
				type: 'checkbox',
				checked: checked,
				onChange: (e) => onChange && onChange(e.target.checked)
			})
		),
		RangeControl: jest.fn(({ onChange, value }) => 
			React.createElement('input', { 
				'data-testid': 'range-control',
				type: 'range',
				value: value,
				onChange: (e) => onChange && onChange(parseInt(e.target.value))
			})
		),
	};
});

jest.mock('./sidebarControl', () => {
	const React = require('react');
	return function MockSidebarControl({ 
		props, 
		categories, 
		handleNumberOfPostsChange, 
		handleCategoryChange,
		handleCategoryToggleControl,
		handleExcerptToggleControl,
		handleFeaturedImageToggleControl
	}) {
		return React.createElement('div', { 'data-testid': 'sidebar-control' }, [
			React.createElement('select', {
				key: 'category-select',
				'data-testid': 'category-select',
				onChange: (e) => handleCategoryChange && handleCategoryChange(e.target.value),
			}, categories ? categories.map(cat => 
				React.createElement('option', { key: cat.value, value: cat.value }, cat.label)
			) : []),
			React.createElement('input', {
				key: 'number-input',
				'data-testid': 'number-input',
				type: 'number',
				defaultValue: props.attributes.numberOfPosts,
				onChange: (e) => handleNumberOfPostsChange && handleNumberOfPostsChange(parseInt(e.target.value)),
			}),
			React.createElement('button', {
				key: 'category-toggle',
				'data-testid': 'category-toggle',
				onClick: () => handleCategoryToggleControl && handleCategoryToggleControl(),
			}, 'Toggle Category'),
			React.createElement('button', {
				key: 'excerpt-toggle',
				'data-testid': 'excerpt-toggle',
				onClick: () => handleExcerptToggleControl && handleExcerptToggleControl(),
			}, 'Toggle Excerpt'),
			React.createElement('button', {
				key: 'featured-image-toggle',
				'data-testid': 'featured-image-toggle',
				onClick: () => handleFeaturedImageToggleControl && handleFeaturedImageToggleControl(),
			}, 'Toggle Featured Image'),
		]);
	};
});

jest.mock('../components/GSPostCardOverlay', () => {
	const React = require('react');
	return function MockGSPostCardOverlay({ data, parent }) {
		return React.createElement('div', { 
			'data-testid': 'post-card',
			'data-post-id': data ? data.id : '',
			'data-post-title': data ? data.title.rendered : ''
		}, data ? data.title.rendered : '');
	};
});

// Import the mocked apiFetch
import apiFetch from '@wordpress/api-fetch';

describe('Featured Posts Edit Component', () => {
	const mockProps = {
		attributes: {
			categories: [],
			selectedCategroyId: '',
			fetchedPosts: [],
			numberOfPosts: 5,
			showCategory: true,
			showExcerpt: true,
			showFeaturedImage: true,
		},
		setAttributes: jest.fn(),
	};

	const mockCategories = [
		{ label: 'Select a category', value: '' },
		{ label: 'Technology', value: 1 },
		{ label: 'Sports', value: 2 },
		{ label: 'News', value: 3 },
	];

	const mockPosts = [
		{
			id: 1,
			title: { rendered: 'Test Post 1' },
			link: 'https://example.com/post-1',
			_embedded: {
				'wp:featuredmedia': [{ source_url: 'image1.jpg', alt_text: 'Test image 1' }],
				'wp:term': [[{ name: 'Technology', link: '/tech' }]],
			},
		},
		{
			id: 2,
			title: { rendered: 'Test Post 2' },
			link: 'https://example.com/post-2',
			_embedded: {
				'wp:featuredmedia': [{ source_url: 'image2.jpg', alt_text: 'Test image 2' }],
				'wp:term': [[{ name: 'Sports', link: '/sports' }]],
			},
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
		apiFetch.mockClear();
		apiFetch.mockResolvedValue([]); // Default to successful empty response
		mockProps.setAttributes.mockClear();
	});

	describe('Component Rendering', () => {
		test('renders without crashing', () => {
			render(React.createElement(edit, mockProps));
			expect(screen.getByTestId('sidebar-control')).toBeInTheDocument();
		});

		test('renders sidebar control with correct props', () => {
			render(React.createElement(edit, mockProps));
			const sidebarControl = screen.getByTestId('sidebar-control');
			expect(sidebarControl).toBeInTheDocument();
		});

		test('renders fallback message when no posts', () => {
			render(React.createElement(edit, mockProps));
			expect(screen.getByText('No sticky posts found')).toBeInTheDocument();
		});

		test('renders posts when available', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
				},
			};
			render(React.createElement(edit, propsWithPosts));
			
			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(2);
			expect(screen.getByText('Test Post 1')).toBeInTheDocument();
			expect(screen.getByText('Test Post 2')).toBeInTheDocument();
		});

		test('limits posts based on numberOfPosts attribute', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
					numberOfPosts: 1,
				},
			};
			render(React.createElement(edit, propsWithPosts));
			
			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(1);
		});
	});

	describe('Event Handlers', () => {
		test('handleNumberOfPostsChange updates numberOfPosts attribute', () => {
			render(React.createElement(edit, mockProps));
			
			const numberInput = screen.getByTestId('number-input');
			fireEvent.change(numberInput, { target: { value: '3' } });

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				numberOfPosts: 3,
			});
		});

		test('handleCategoryChange resets data when no category selected', () => {
			render(React.createElement(edit, mockProps));
			
			const categorySelect = screen.getByTestId('category-select');
			fireEvent.change(categorySelect, { target: { value: '' } });

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				selectedCategroyId: '',
				selectedCategoryPosts: [],
				fetchedPosts: [],
			});
		});
	});

	describe('Toggle Controls', () => {
		test('handleCategoryToggleControl toggles showCategory attribute', () => {
			render(React.createElement(edit, mockProps));
			
			const categoryToggle = screen.getByTestId('category-toggle');
			fireEvent.click(categoryToggle);

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				showCategory: false,
			});
		});

		test('handleExcerptToggleControl toggles showExcerpt attribute', () => {
			render(React.createElement(edit, mockProps));
			
			const excerptToggle = screen.getByTestId('excerpt-toggle');
			fireEvent.click(excerptToggle);

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				showExcerpt: false,
			});
		});

		test('handleFeaturedImageToggleControl toggles showFeaturedImage attribute', () => {
			render(React.createElement(edit, mockProps));
			
			const featuredImageToggle = screen.getByTestId('featured-image-toggle');
			fireEvent.click(featuredImageToggle);

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				showFeaturedImage: false,
			});
		});
	});

	describe('Edge Cases', () => {
		test('handles empty posts array', () => {
			const propsWithEmptyPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: [],
				},
			};
			render(React.createElement(edit, propsWithEmptyPosts));
			
			expect(screen.getByText('No sticky posts found')).toBeInTheDocument();
		});

		test('handles zero numberOfPosts', () => {
			const propsWithZeroPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
					numberOfPosts: 0,
				},
			};
			render(React.createElement(edit, propsWithZeroPosts));
			
			const postCards = screen.queryAllByTestId('post-card');
			expect(postCards).toHaveLength(0);
		});
	});

	describe('API Integration', () => {
		test('fetches categories on mount when categories array is empty', async () => {
			const mockCategoryData = [
				{ id: 1, name: 'Technology' },
				{ id: 2, name: 'Sports' },
			];

			apiFetch.mockResolvedValueOnce(mockCategoryData);

			render(React.createElement(edit, mockProps));

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({ path: '/wp/v2/categories' });
			});

			await waitFor(() => {
				expect(mockProps.setAttributes).toHaveBeenCalledWith({
					categories: [
						{ label: 'Select a category', value: '' },
						{ label: 'Technology', value: 1 },
						{ label: 'Sports', value: 2 },
					],
				});
			});
		});

		test('fetches sticky posts when no category is selected', async () => {
			apiFetch.mockResolvedValueOnce(mockPosts);

			render(React.createElement(edit, mockProps));

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/posts?_embed&per_page=10&sticky=true',
				});
			});
		});

	});

	describe('Data Processing', () => {
		test('processes category data correctly with mapping', async () => {
			const mockCategoryData = [
				{ id: 1, name: 'Technology' },
				{ id: 2, name: 'Sports' },
				{ id: 3, name: 'News' },
			];

			apiFetch.mockResolvedValueOnce(mockCategoryData);

			render(React.createElement(edit, mockProps));

			await waitFor(() => {
				expect(mockProps.setAttributes).toHaveBeenCalledWith({
					categories: [
						{ label: 'Select a category', value: '' },
						{ label: 'Technology', value: 1 },
						{ label: 'Sports', value: 2 },
						{ label: 'News', value: 3 },
					],
				});
			});
		});

		test('handles empty category data', async () => {
			apiFetch.mockResolvedValueOnce([]);

			render(React.createElement(edit, mockProps));

			await waitFor(() => {
				expect(mockProps.setAttributes).toHaveBeenCalledWith({
					categories: [
						{ label: 'Select a category', value: '' },
					],
				});
			});
		});
	});

	describe('Accessibility', () => {
		test('renders with proper block props', () => {
			render(React.createElement(edit, mockProps));
			// The useBlockProps mock will be called
		});

		test('fallback message is accessible', () => {
			render(React.createElement(edit, mockProps));
			const fallbackMessage = screen.getByText('No sticky posts found');
			expect(fallbackMessage).toBeInTheDocument();
		});
	});
});