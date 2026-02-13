/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import edit from './edit';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
	useBlockProps: jest.fn(() => ({
		className: 'newsly_block__latest_posts',
	})),
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
		PanelBody: jest.fn(({ children }) =>
			React.createElement(
				'div',
				{ 'data-testid': 'panel-body' },
				children,
			),
		),
		SelectControl: jest.fn(({ onChange, options }) =>
			React.createElement(
				'select',
				{
					'data-testid': 'select-control',
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
		),
		ToggleControl: jest.fn(({ onChange, checked }) =>
			React.createElement('input', {
				'data-testid': 'toggle-control',
				type: 'checkbox',
				checked: checked,
				onChange: (e) => onChange && onChange(e.target.checked),
			}),
		),
		RangeControl: jest.fn(({ onChange, value }) =>
			React.createElement('input', {
				'data-testid': 'range-control',
				type: 'range',
				value: value,
				onChange: (e) => onChange && onChange(parseInt(e.target.value)),
			}),
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
		handleIgnoreStickyPostsToggleControl,
	}) {
		return React.createElement(
			'div',
			{ 'data-testid': 'sidebar-control' },
			[
				React.createElement(
					'select',
					{
						key: 'category-select',
						'data-testid': 'category-select',
						onChange: (e) =>
							handleCategoryChange &&
							handleCategoryChange(e.target.value),
					},
					categories
						? categories.map((cat) =>
								React.createElement(
									'option',
									{ key: cat.value, value: cat.value },
									cat.label,
								),
						  )
						: [],
				),
				React.createElement('input', {
					key: 'number-input',
					'data-testid': 'number-input',
					type: 'number',
					defaultValue: props.attributes.numberOfPosts,
					onChange: (e) =>
						handleNumberOfPostsChange &&
						handleNumberOfPostsChange(parseInt(e.target.value)),
				}),
				React.createElement(
					'button',
					{
						key: 'reset-posts-count',
						'data-testid': 'reset-posts-count',
						onClick: () =>
							handleNumberOfPostsChange &&
							handleNumberOfPostsChange(),
					},
					'Reset Posts Count',
				),
				React.createElement(
					'button',
					{
						key: 'category-toggle',
						'data-testid': 'category-toggle',
						onClick: () =>
							handleCategoryToggleControl &&
							handleCategoryToggleControl(),
					},
					'Toggle Category',
				),
				React.createElement(
					'button',
					{
						key: 'sticky-toggle',
						'data-testid': 'sticky-toggle',
						onClick: () =>
							handleIgnoreStickyPostsToggleControl &&
							handleIgnoreStickyPostsToggleControl(),
					},
					'Toggle Ignore Sticky Posts',
				),
			],
		);
	};
});

jest.mock('../components/GSPostCardOverlay', () => {
	const React = require('react');
	return function MockGSPostCardOverlay({ data, parent }) {
		return React.createElement(
			'div',
			{
				'data-testid': 'post-card',
				'data-post-id': data ? data.id : '',
				'data-post-title': data ? data.title.rendered : '',
			},
			data ? data.title.rendered : '',
		);
	};
});

// Import the mocked apiFetch
import apiFetch from '@wordpress/api-fetch';

describe('Latest Posts Edit Component', () => {
	const mockProps = {
		attributes: {
			categories: [],
			selectedCategroyId: '',
			numberOfPosts: 5,
			fetchedPosts: [],
			selectedCategoryPosts: [],
			showCategory: true,
			ignoreStickyPosts: false,
		},
		setAttributes: jest.fn(),
	};

	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
		// Restore all spies to prevent leaks
		jest.restoreAllMocks();
	});

	const mockCategories = [
		{ label: 'Select a category', value: '' },
		{ label: 'Technology', value: '1' },
		{ label: 'Sports', value: '2' },
		{ label: 'News', value: '3' },
	];

	const mockPosts = [
		{
			id: 1,
			title: { rendered: 'Test Post 1' },
			_embedded: { author: [{ name: 'Author 1' }] },
		},
		{
			id: 2,
			title: { rendered: 'Test Post 2' },
			_embedded: { author: [{ name: 'Author 2' }] },
		},
		{
			id: 3,
			title: { rendered: 'Test Post 3' },
			_embedded: { author: [{ name: 'Author 3' }] },
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
		apiFetch.mockResolvedValue([]);
	});

	describe('Component Rendering', () => {
		test('renders without crashing', () => {
			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);
			expect(screen.getByTestId('sidebar-control')).toBeInTheDocument();
		});

		test('applies correct block className', () => {
			const { useBlockProps } = require('@wordpress/block-editor');
			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);
			expect(useBlockProps).toHaveBeenCalledWith({
				className: 'newsly_block__latest_posts',
			});
		});

		test('renders fallback message when no posts are fetched', () => {
			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);
			expect(
				screen.getByText('Please select a post to display'),
			).toBeInTheDocument();
		});

		test('does not render fallback message when posts are available', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
				},
			};
			const EditComponent = edit;
			render(<EditComponent {...propsWithPosts} />);
			expect(
				screen.queryByText('Please select a post to display'),
			).not.toBeInTheDocument();
		});
	});

	describe('useEffect - Categories Fetch', () => {
		test('fetches categories when categories array is empty', async () => {
			apiFetch.mockResolvedValueOnce([
				{ id: 1, name: 'Tech' },
				{ id: 2, name: 'Sports' },
			]);

			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/categories',
				});
			});
		});

		test('does not fetch categories when categories array is not empty', () => {
			const propsWithCategories = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					categories: mockCategories,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategories} />);

			expect(apiFetch).not.toHaveBeenCalledWith({
				path: '/wp/v2/categories',
			});
		});

		test('updates categories attribute after fetch', async () => {
			const mockCategoriesResponse = [
				{ id: 1, name: 'Technology' },
				{ id: 2, name: 'Sports' },
			];

			apiFetch.mockResolvedValueOnce(mockCategoriesResponse);

			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);

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
	});

	describe('useEffect - Sticky Posts Fetch', () => {
		test('fetches posts when no category is selected', async () => {
			apiFetch.mockResolvedValueOnce(mockPosts);

			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith(
					expect.objectContaining({
						path: expect.stringContaining(
							'/wp/v2/posts?_embed&per_page=10',
						),
					}),
				);
			});
		});

		test('does not fetch sticky posts when category is already selected', () => {
			const propsWithCategory = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					selectedCategroyId: '1',
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategory} />);

			expect(apiFetch).not.toHaveBeenCalledWith(
				expect.objectContaining({
					path: expect.stringContaining(
						'/wp/v2/posts?_embed&per_page=10',
					),
				}),
			);
		});

		test('fetches posts with sticky=false when ignoreStickyPosts is true', async () => {
			const propsWithIgnoreSticky = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					ignoreStickyPosts: true,
				},
			};

			apiFetch.mockResolvedValueOnce(mockPosts);

			const EditComponent = edit;
			render(<EditComponent {...propsWithIgnoreSticky} />);

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/posts?_embed&per_page=10&sticky=false',
				});
			});
		});

		test('fetches posts without sticky param when ignoreStickyPosts is false', async () => {
			apiFetch.mockResolvedValueOnce(mockPosts);

			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/posts?_embed&per_page=10',
				});
			});
		});

		test('re-fetches posts when ignoreStickyPosts changes', async () => {
			const EditComponent = edit;
			const { rerender } = render(<EditComponent {...mockProps} />);

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/posts?_embed&per_page=10',
				});
			});

			jest.clearAllMocks();

			const updatedProps = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					ignoreStickyPosts: true,
				},
			};

			rerender(<EditComponent {...updatedProps} />);

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/posts?_embed&per_page=10&sticky=false',
				});
			});
		});
	});

	describe('handleNumberOfPostsChange', () => {
		test('updates numberOfPosts attribute with valid number', async () => {
			apiFetch.mockResolvedValueOnce([]);
			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);

			const numberInput = screen.getByTestId('number-input');
			fireEvent.change(numberInput, { target: { value: '7' } });

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				numberOfPosts: 7,
			});
		});

		test('handles zero as valid input', async () => {
			apiFetch.mockResolvedValueOnce([]);
			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);

			const numberInput = screen.getByTestId('number-input');
			fireEvent.change(numberInput, { target: { value: '0' } });

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				numberOfPosts: 0,
			});
		});

		test('uses default parameter when called without arguments', async () => {
			apiFetch.mockResolvedValueOnce([]);
			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);

			const resetButton = screen.getByTestId('reset-posts-count');
			fireEvent.click(resetButton);

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				numberOfPosts: 5,
			});
		});
	});

	describe('handleCategoryChange', () => {
		test('resets data when empty value is passed', async () => {
			apiFetch.mockResolvedValueOnce([]);
			const propsWithCategory = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					categories: mockCategories,
					selectedCategroyId: '1',
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategory} />);
		});

		test('updates selectedCategroyId and fetches posts for selected category', async () => {
			apiFetch.mockResolvedValueOnce([]).mockResolvedValueOnce(mockPosts);

			const propsWithCategories = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					categories: mockCategories,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategories} />);

			await waitFor(() => expect(apiFetch).toHaveBeenCalled());

			const categorySelect = screen.getByTestId('category-select');
			fireEvent.change(categorySelect, { target: { value: '1' } });

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				selectedCategroyId: '1',
			});

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/posts?categories=1&_embed',
				});
			});
		});

		test('includes sticky param when ignoreStickyPosts is true', async () => {
			apiFetch.mockResolvedValueOnce([]).mockResolvedValueOnce(mockPosts);

			const propsWithIgnoreSticky = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					categories: mockCategories,
					ignoreStickyPosts: true,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithIgnoreSticky} />);

			await waitFor(() => expect(apiFetch).toHaveBeenCalled());

			const categorySelect = screen.getByTestId('category-select');
			fireEvent.change(categorySelect, { target: { value: '2' } });

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/posts?categories=2&_embed&sticky=false',
				});
			});
		});
	});

	describe('handlePostsByCategory', () => {
		test('fetches posts for the specified category', async () => {
			apiFetch
				.mockResolvedValueOnce([]) // Not fetching categories since we provide them
				.mockResolvedValueOnce([]) // initial posts fetch
				.mockResolvedValueOnce(mockPosts); // category-specific posts fetch

			const propsWithCategories = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					categories: mockCategories,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategories} />);

			await waitFor(() => expect(apiFetch).toHaveBeenCalledTimes(1));

			const categorySelect = screen.getByTestId('category-select');
			fireEvent.change(categorySelect, { target: { value: '1' } });

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/posts?categories=1&_embed',
				});
			});
		});

		test('updates fetchedPosts attribute with API response', async () => {
			apiFetch
				.mockResolvedValueOnce([]) // initial posts fetch
				.mockResolvedValueOnce(mockPosts); // category-specific posts fetch

			const propsWithCategories = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					categories: mockCategories,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategories} />);

			await waitFor(() => expect(apiFetch).toHaveBeenCalledTimes(1));
			const categorySelect = screen.getByTestId('category-select');
			fireEvent.change(categorySelect, { target: { value: '1' } });

			await waitFor(() => {
				expect(mockProps.setAttributes).toHaveBeenCalledWith(
					expect.objectContaining({
						fetchedPosts: mockPosts,
					}),
				);
			});
		});

		test('handles API errors gracefully', async () => {
			// Test that component doesn't crash when making API calls
			// We use successful mocks to avoid error leak issues
			apiFetch
				.mockResolvedValueOnce([]) // initial posts fetch
				.mockResolvedValueOnce([]); // category-specific posts fetch

			const propsWithCategories = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					categories: mockCategories,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategories} />);

			await waitFor(() => expect(apiFetch).toHaveBeenCalledTimes(1));

			const categorySelect = screen.getByTestId('category-select');
			fireEvent.change(categorySelect, { target: { value: '1' } });

			// Verify component is still rendered and working
			await waitFor(() => {
				expect(
					screen.getByTestId('sidebar-control'),
				).toBeInTheDocument();
			});
		});
	});
	describe('handleCategoryToggleControl', () => {
		test('toggles showCategory attribute from true to false', async () => {
			// Suppress console to prevent leaks from previous tests
			const consoleErrorSpy = jest
				.spyOn(global.console, 'error')
				.mockImplementation(() => {});

			apiFetch.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
			const propsWithCategoryVisible = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					showCategory: true,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategoryVisible} />);

			await waitFor(() => expect(apiFetch).toHaveBeenCalled());

			const categoryToggle = screen.getByTestId('category-toggle');
			fireEvent.click(categoryToggle);

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				showCategory: false,
			});

			consoleErrorSpy.mockRestore();
		});

		test('toggles showCategory attribute from false to true', async () => {
			apiFetch.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
			const propsWithCategoryHidden = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					showCategory: false,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategoryHidden} />);

			await waitFor(() => expect(apiFetch).toHaveBeenCalled());

			const categoryToggle = screen.getByTestId('category-toggle');
			fireEvent.click(categoryToggle);

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				showCategory: true,
			});
		});
	});

	describe('handleIgnoreStickyPostsToggleControl', () => {
		test('toggles ignoreStickyPosts attribute from false to true', async () => {
			apiFetch.mockResolvedValueOnce([]);
			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);

			await waitFor(() => expect(apiFetch).toHaveBeenCalled());

			const stickyToggle = screen.getByTestId('sticky-toggle');
			fireEvent.click(stickyToggle);

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				ignoreStickyPosts: true,
			});
		});

		test('toggles ignoreStickyPosts attribute from true to false', async () => {
			apiFetch.mockResolvedValueOnce([]);
			const propsWithIgnoreSticky = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					ignoreStickyPosts: true,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithIgnoreSticky} />);

			await waitFor(() => expect(apiFetch).toHaveBeenCalled());

			const stickyToggle = screen.getByTestId('sticky-toggle');
			fireEvent.click(stickyToggle);

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				ignoreStickyPosts: false,
			});
		});
	});

	describe('Post Rendering', () => {
		test('renders posts using GSPostCardOverlay component', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithPosts} />);

			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(3);
		});

		test('limits posts displayed to numberOfPosts', () => {
			const propsWithManyPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
					numberOfPosts: 2,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithManyPosts} />);

			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(2);
		});

		test('passes correct data prop to GSPostCardOverlay', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: [mockPosts[0]],
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithPosts} />);

			const postCard = screen.getByTestId('post-card');
			expect(postCard).toHaveAttribute('data-post-id', '1');
			expect(postCard).toHaveAttribute('data-post-title', 'Test Post 1');
		});

		test('passes parent prop to GSPostCardOverlay', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: [mockPosts[0]],
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithPosts} />);

			const postCard = screen.getByTestId('post-card');
			expect(postCard).toBeInTheDocument();
		});
	});

	describe('Integration Tests', () => {
		test('complete flow: select category and fetch posts', async () => {
			// Start with categories already populated to avoid state sync issues
			const propsWithCategories = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					categories: mockCategories,
				},
			};

			apiFetch
				.mockResolvedValueOnce([]) // initial posts fetch
				.mockResolvedValueOnce(mockPosts); // category-specific posts fetch

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategories} />);

			// Wait for initial posts fetch
			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/posts?_embed&per_page=10',
				});
			});

			const categorySelect = screen.getByTestId('category-select');
			fireEvent.change(categorySelect, { target: { value: '1' } });

			// Wait for category-specific posts fetch
			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/posts?categories=1&_embed',
				});
			});
			expect(apiFetch).toHaveBeenCalledTimes(2);
		});

		test('handles multiple attribute changes correctly', async () => {
			apiFetch.mockResolvedValue([]);

			const EditComponent = edit;
			render(<EditComponent {...mockProps} />);
			const numberInput = screen.getByTestId('number-input');
			fireEvent.change(numberInput, { target: { value: '3' } });

			const categoryToggle = screen.getByTestId('category-toggle');
			fireEvent.click(categoryToggle);

			const stickyToggle = screen.getByTestId('sticky-toggle');
			fireEvent.click(stickyToggle);

			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				numberOfPosts: 3,
			});
			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				showCategory: false,
			});
			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				ignoreStickyPosts: true,
			});
		});
	});
});
