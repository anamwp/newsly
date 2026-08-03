/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import edit from './edit';

jest.mock('@wordpress/block-editor', () => {
	const React = require('react');
	const {
		wordPressBlockEditorMock,
	} = require('../__mocks__/wordpress-block-editor');
	return {
		...wordPressBlockEditorMock,
		useBlockProps: jest.fn((props = {}) => props),
		RichText: ({ tagName = 'p', value }) =>
			React.createElement(tagName, { 'data-testid': 'rich-text' }, value),
	};
});

jest.mock('@wordpress/api-fetch', () => ({
	__esModule: true,
	default: require('../__mocks__/wordpress-api-fetch').wordPressApiFetchMock,
}));

jest.mock(
	'@wordpress/element',
	() => require('../__mocks__/wordpress-element').wordPressElementMock,
);

jest.mock(
	'@wordpress/i18n',
	() => require('../__mocks__/wordpress-i18n').wordPressI18nMock,
);

jest.mock('@wordpress/components', () => {
	const React = require('react');
	return {
		Disabled: ({ children }) =>
			React.createElement('div', { 'data-testid': 'disabled' }, children),
	};
});

jest.mock('../components/GSPostCard', () => {
	const React = require('react');
	return function MockGSPostCard({ data }) {
		return React.createElement(
			'div',
			{
				'data-testid': 'post-card',
				'data-post-id': data ? data.id : '',
			},
			data ? data.title.rendered : '',
		);
	};
});

jest.mock('./sidebarControl', () => {
	const React = require('react');
	return function MockSidebarControl({
		handleCategoryChange,
		handleNumberofPoststoShow,
		handleNumberofPostsColumn,
		handleCategoryToggleControl,
		handleExcerptToggleControl,
		handleFeaturedExcerptToggleControl,
		handleFeaturedImageToggleControl,
	}) {
		return React.createElement(
			'div',
			{ 'data-testid': 'sidebar-control' },
			[
				React.createElement(
					'button',
					{
						key: 'category-change',
						'data-testid': 'category-change',
						onClick: () =>
							handleCategoryChange &&
							handleCategoryChange(['1', '2']),
					},
					'Change Category',
				),
				React.createElement(
					'button',
					{
						key: 'category-change-empty',
						'data-testid': 'category-change-empty',
						onClick: () =>
							handleCategoryChange && handleCategoryChange([]),
					},
					'Clear Category',
				),
				React.createElement(
					'button',
					{
						key: 'category-change-many',
						'data-testid': 'category-change-many',
						onClick: () =>
							handleCategoryChange &&
							handleCategoryChange(
								Array.from({ length: 12 }, (_, i) =>
									String(i + 1),
								),
							),
					},
					'Select 12 Categories (Range Select)',
				),
				React.createElement(
					'button',
					{
						key: 'category-change-unknown',
						'data-testid': 'category-change-unknown',
						onClick: () =>
							handleCategoryChange &&
							handleCategoryChange(['1', '99']),
					},
					'Change Category To Unknown',
				),
				React.createElement(
					'button',
					{
						key: 'category-change-single',
						'data-testid': 'category-change-single',
						onClick: () =>
							handleCategoryChange && handleCategoryChange(['1']),
					},
					'Change Category To Single',
				),
				React.createElement(
					'button',
					{
						key: 'posts-to-show',
						'data-testid': 'posts-to-show',
						onClick: () =>
							handleNumberofPoststoShow &&
							handleNumberofPoststoShow(4),
					},
					'Posts To Show',
				),
				React.createElement(
					'button',
					{
						key: 'posts-column',
						'data-testid': 'posts-column',
						onClick: () =>
							handleNumberofPostsColumn &&
							handleNumberofPostsColumn(3),
					},
					'Posts Column',
				),
				React.createElement(
					'button',
					{
						key: 'toggle-category',
						'data-testid': 'toggle-category',
						onClick: () =>
							handleCategoryToggleControl &&
							handleCategoryToggleControl(),
					},
					'Toggle Category',
				),
				React.createElement(
					'button',
					{
						key: 'toggle-excerpt',
						'data-testid': 'toggle-excerpt',
						onClick: () =>
							handleExcerptToggleControl &&
							handleExcerptToggleControl(),
					},
					'Toggle Excerpt',
				),
				React.createElement(
					'button',
					{
						key: 'toggle-featured-excerpt',
						'data-testid': 'toggle-featured-excerpt',
						onClick: () =>
							handleFeaturedExcerptToggleControl &&
							handleFeaturedExcerptToggleControl(),
					},
					'Toggle Featured Excerpt',
				),
				React.createElement(
					'button',
					{
						key: 'toggle-featured-image',
						'data-testid': 'toggle-featured-image',
						onClick: () =>
							handleFeaturedImageToggleControl &&
							handleFeaturedImageToggleControl(),
					},
					'Toggle Featured Image',
				),
			],
		);
	};
});

import apiFetch from '@wordpress/api-fetch';

describe('Category Posts Edit Component', () => {
	const mockPostsCategory1 = [
		{
			id: 11,
			title: { rendered: 'Cat 1 Post' },
			excerpt: { rendered: '<p>Excerpt 1</p>' },
			categories: [1],
			featured_media: 0,
			link: '#',
		},
	];

	const mockPostsCategory2 = [
		{
			id: 21,
			title: { rendered: 'Cat 2 Post' },
			excerpt: { rendered: '<p>Excerpt 2</p>' },
			categories: [2],
			featured_media: 0,
			link: '#',
		},
	];

	const mockCategories = [
		{ label: 'Tech', value: '1' },
		{ label: 'News', value: '2' },
	];

	const baseProps = {
		attributes: {
			layout: 'grid',
			postColumn: 3,
			postsToShow: 3,
			categories: [],
			selectedCategroyId: [],
			selectedCategories: [],
			fetchedPosts: [],
			allCategoryPosts: {},
			activeTab: null,
			selectedPostId: null,
			showCategory: true,
			showExcerpt: true,
			showFeaturedImage: false,
			showFeaturedExcerpt: false,
		},
		setAttributes: jest.fn(),
	};

	let consoleLogSpy;
	let consoleErrorSpy;

	beforeEach(() => {
		jest.clearAllMocks();
		apiFetch.mockResolvedValue([]);
		consoleLogSpy = jest
			.spyOn(global.console, 'log')
			.mockImplementation(() => {});
		consoleErrorSpy = jest
			.spyOn(global.console, 'error')
			.mockImplementation(() => {});
	});

	afterEach(() => {
		if (consoleLogSpy) {
			consoleLogSpy.mockRestore();
		}
		if (consoleErrorSpy) {
			consoleErrorSpy.mockRestore();
		}
	});

	test('renders wrapper, sidebar, and fallback message', async () => {
		const EditComponent = edit;
		render(<EditComponent {...baseProps} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());
		expect(screen.getByTestId('sidebar-control')).toBeInTheDocument();
		expect(
			screen.getByText(
				'Please select one or more categories to display posts',
			),
		).toBeInTheDocument();
	});

	test('fetches categories on mount when categories are empty', async () => {
		apiFetch.mockResolvedValueOnce([
			{ id: 1, name: 'Tech' },
			{ id: 2, name: 'News' },
		]);

		const EditComponent = edit;
		render(<EditComponent {...baseProps} />);

		await waitFor(() => {
			expect(apiFetch).toHaveBeenCalledWith({
				path: '/wp/v2/categories?per_page=100&orderby=count&order=desc',
			});
		});

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith({
				categories: [
					{ label: 'Tech', value: '1' },
					{ label: 'News', value: '2' },
				],
			});
		});
	});

	test('handles category change and fetches posts for selected categories', async () => {
		apiFetch
			.mockResolvedValueOnce(mockPostsCategory1)
			.mockResolvedValueOnce(mockPostsCategory2);

		const propsWithCategories = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				categories: mockCategories,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithCategories} />);

		fireEvent.click(screen.getByTestId('category-change'));

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith({
				selectedCategroyId: ['1', '2'],
				selectedCategories: [
					{ id: 1, label: 'Tech' },
					{ id: 2, label: 'News' },
				],
			});
		});

		await waitFor(() => {
			expect(apiFetch).toHaveBeenCalledWith({
				path: '/wp/v2/posts?categories=1&per_page=24&_embed',
			});
			expect(apiFetch).toHaveBeenCalledWith({
				path: '/wp/v2/posts?categories=2&per_page=24&_embed',
			});
		});

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith(
				expect.objectContaining({
					activeTab: 1,
					selectedPostId: 11,
					allCategoryPosts: expect.any(Object),
				}),
			);
		});
	});

	test('strips bloated _embed data (media sizes, full term objects) before storing fetched posts', async () => {
		const rawPostWithFullEmbeds = {
			id: 21,
			title: { rendered: 'Full Post' },
			excerpt: { rendered: '<p>Excerpt</p>' },
			categories: [1],
			featured_media: 55,
			link: '#',
			_embedded: {
				'wp:featuredmedia': [
					{
						source_url: 'https://example.com/image-full.jpg',
						alt_text: 'An image',
						media_details: {
							sizes: {
								thumbnail: { source_url: 'thumb.jpg', width: 150 },
								medium: { source_url: 'medium.jpg', width: 300 },
							},
						},
						guid: { rendered: 'https://example.com/?attachment_id=55' },
					},
				],
				'wp:term': [
					[
						{
							id: 1,
							name: 'Tech',
							link: 'https://example.com/category/tech',
							description: 'Tech posts',
							_links: { self: [{ href: 'https://example.com/wp-json' }] },
						},
					],
					// WP's _embed can include a null group when a taxonomy
					// query yields nothing - must not crash the trimmer.
					null,
				],
			},
		};

		apiFetch.mockResolvedValueOnce([rawPostWithFullEmbeds]);

		const propsWithCategories = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				categories: mockCategories,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithCategories} />);

		fireEvent.click(screen.getByTestId('category-change-single'));

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith(
				expect.objectContaining({
					allCategoryPosts: {
						1: [
							{
								id: 21,
								link: '#',
								featured_media: 55,
								title: { rendered: 'Full Post' },
								excerpt: { rendered: '<p>Excerpt</p>' },
								categories: [1],
								_embedded: {
									'wp:featuredmedia': [
										{
											source_url:
												'https://example.com/image-full.jpg',
											alt_text: 'An image',
										},
									],
									'wp:term': [
										[
											{
												name: 'Tech',
												link: 'https://example.com/category/tech',
											},
										],
										[],
									],
								},
							},
						],
					},
				}),
			);
		});
	});

	test('handles posts with missing title/excerpt/featured media/terms when storing', async () => {
		const sparsePost = {
			id: 22,
			link: '#',
			categories: [1],
			featured_media: 0,
		};

		apiFetch.mockResolvedValueOnce([sparsePost]);

		const propsWithCategories = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				categories: mockCategories,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithCategories} />);

		fireEvent.click(screen.getByTestId('category-change-single'));

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith(
				expect.objectContaining({
					allCategoryPosts: {
						1: [
							{
								id: 22,
								link: '#',
								featured_media: 0,
								title: { rendered: '' },
								excerpt: { rendered: '' },
								categories: [1],
								_embedded: {
									'wp:featuredmedia': [],
									'wp:term': [],
								},
							},
						],
					},
				}),
			);
		});
	});

	test('toggles display flags via sidebar controls', async () => {
		const EditComponent = edit;
		render(<EditComponent {...baseProps} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		fireEvent.click(screen.getByTestId('toggle-category'));
		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			showCategory: false,
		});

		fireEvent.click(screen.getByTestId('toggle-excerpt'));
		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			showExcerpt: false,
		});

		fireEvent.click(screen.getByTestId('toggle-featured-image'));
		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			showFeaturedImage: true,
		});

		fireEvent.click(screen.getByTestId('toggle-featured-excerpt'));
		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			showFeaturedExcerpt: true,
		});
	});

	test('renders category tabs and post cards from allCategoryPosts', async () => {
		const propsWithPosts = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				selectedCategories: [
					{ id: 1, label: 'Tech' },
					{ id: 2, label: 'News' },
				],
				activeTab: 1,
				allCategoryPosts: {
					1: mockPostsCategory1,
					2: mockPostsCategory2,
				},
				postsToShow: 1,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithPosts} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		expect(screen.getByText('Tech')).toBeInTheDocument();
		expect(screen.getByText('News')).toBeInTheDocument();

		const postCards = screen.getAllByTestId('post-card');
		expect(postCards).toHaveLength(2);
	});

	test('updates active tab on tab click', async () => {
		const propsWithPosts = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				selectedCategories: [
					{ id: 1, label: 'Tech' },
					{ id: 2, label: 'News' },
				],
				activeTab: 1,
				allCategoryPosts: {
					1: mockPostsCategory1,
					2: mockPostsCategory2,
				},
				postsToShow: 1,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithPosts} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		fireEvent.click(screen.getByRole('tab', { name: 'News' }));

		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			activeTab: 2,
			fetchedPosts: [mockPostsCategory2],
			selectedPostId: 21,
		});
	});

	test('activates first category from stored fetchedPostCategoryData on mount', async () => {
		const propsWithStoredData = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				selectedCategories: [
					{ id: 1, label: 'Tech' },
					{ id: 2, label: 'News' },
				],
				activeTab: null,
				fetchedPostCategoryData: { 1: mockPostsCategory1 },
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithStoredData} />);

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith({
				activeTab: 1,
				fetchedPosts: [mockPostsCategory1],
				selectedPostId: 11,
			});
		});
	});

	test('sets first category as active tab on mount when no stored data is available', async () => {
		const propsWithoutStoredData = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				selectedCategories: [{ id: 1, label: 'Tech' }],
				activeTab: null,
				fetchedPostCategoryData: null,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithoutStoredData} />);

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith({
				activeTab: 1,
			});
		});
	});

	test('updates posts-to-show and posts-column counts from sidebar controls', async () => {
		const EditComponent = edit;
		render(<EditComponent {...baseProps} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		fireEvent.click(screen.getByTestId('posts-to-show'));
		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			postsToShow: 4,
		});

		fireEvent.click(screen.getByTestId('posts-column'));
		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			postColumn: 3,
		});
	});

	test('resets category-related attributes when categories are cleared', async () => {
		const propsWithCategories = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				categories: mockCategories,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithCategories} />);

		fireEvent.click(screen.getByTestId('category-change-empty'));

		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			selectedCategories: [],
			fetchedPosts: [],
			selectedPostId: null,
			activeTab: null,
			allCategoryPosts: {},
		});
	});

	test('logs an error when fetching posts by category fails', async () => {
		apiFetch.mockRejectedValueOnce(new Error('boom'));

		const propsWithCategories = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				categories: mockCategories,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithCategories} />);

		fireEvent.click(screen.getByTestId('category-change'));

		await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalled());
	});

	test('ignores a stale category-fetch response superseded by a newer request', async () => {
		const resolvers = [];
		apiFetch.mockImplementation(
			() =>
				new Promise((resolve) => {
					resolvers.push(resolve);
				}),
		);

		const propsWithCategories = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				categories: mockCategories,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithCategories} />);

		// First (soon to be stale) category change.
		fireEvent.click(screen.getByTestId('category-change'));
		await waitFor(() => expect(resolvers.length).toBe(2));
		const staleResolvers = resolvers.splice(0, 2);

		// Second (fresh) category change fired before the first resolves.
		fireEvent.click(screen.getByTestId('category-change'));
		await waitFor(() => expect(resolvers.length).toBe(2));
		const freshResolvers = resolvers.splice(0, 2);

		baseProps.setAttributes.mockClear();

		// The newer request resolves first.
		freshResolvers[0](mockPostsCategory1);
		freshResolvers[1](mockPostsCategory2);

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith(
				expect.objectContaining({ activeTab: 1 }),
			);
		});

		const callsAfterFreshResolved =
			baseProps.setAttributes.mock.calls.length;

		// The older request resolving afterwards must be ignored.
		staleResolvers[0]([
			{
				id: 999,
				title: { rendered: 'Stale Post' },
				excerpt: { rendered: '' },
				categories: [1],
				featured_media: 0,
				link: '#',
			},
		]);
		staleResolvers[1]([]);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(baseProps.setAttributes.mock.calls.length).toBe(
			callsAfterFreshResolved,
		);
	});

	test('omits the grid column class when layout is not grid', async () => {
		const propsNonGrid = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				layout: 'card',
			},
		};

		const EditComponent = edit;
		const { container } = render(<EditComponent {...propsNonGrid} />);
		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		expect(container.firstChild.className).not.toMatch(/grid-\d/);
	});

	test('sets active tab without posts on mount when stored data for the category is empty', async () => {
		const propsWithEmptyStoredData = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				selectedCategories: [{ id: 1, label: 'Tech' }],
				activeTab: null,
				fetchedPostCategoryData: { 1: [] },
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithEmptyStoredData} />);

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith({
				activeTab: 1,
				fetchedPosts: [[]],
				selectedPostId: null,
			});
		});
	});

	test('labels an unrecognized category id as Unknown Category', async () => {
		apiFetch.mockResolvedValue([]);

		const propsWithCategories = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				categories: mockCategories,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithCategories} />);

		fireEvent.click(screen.getByTestId('category-change-unknown'));

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith({
				selectedCategroyId: ['1', '99'],
				selectedCategories: [
					{ id: 1, label: 'Tech' },
					{ id: 99, label: 'Unknown Category' },
				],
			});
		});
	});

	test('sets selectedPostId to null when the first fetched category has no posts', async () => {
		apiFetch.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

		const propsWithCategories = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				categories: mockCategories,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithCategories} />);

		fireEvent.click(screen.getByTestId('category-change'));

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith(
				expect.objectContaining({
					fetchedPosts: [[]],
					selectedPostId: null,
				}),
			);
		});
	});

	test('sets selectedPostId to null when clicking a tab whose stored posts array is empty', async () => {
		const propsWithPosts = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				selectedCategories: [
					{ id: 1, label: 'Tech' },
					{ id: 2, label: 'News' },
				],
				activeTab: 1,
				allCategoryPosts: {
					1: mockPostsCategory1,
					2: [],
				},
				postsToShow: 1,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithPosts} />);
		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		fireEvent.click(screen.getByRole('tab', { name: 'News' }));

		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			activeTab: 2,
			fetchedPosts: [[]],
			selectedPostId: null,
		});
	});

	test('falls back to an empty list when clicking a tab with no stored posts entry', async () => {
		const propsWithPosts = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				selectedCategories: [
					{ id: 1, label: 'Tech' },
					{ id: 2, label: 'News' },
				],
				activeTab: 1,
				allCategoryPosts: {
					1: mockPostsCategory1,
				},
				postsToShow: 1,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithPosts} />);
		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		fireEvent.click(screen.getByRole('tab', { name: 'News' }));

		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			activeTab: 2,
			fetchedPosts: [[]],
			selectedPostId: null,
		});
	});

	describe('MAX_SELECTABLE_CATEGORIES cap', () => {
		let alertSpy;

		beforeEach(() => {
			alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
		});

		afterEach(() => {
			alertSpy.mockRestore();
		});

		test('selecting more than 10 categories alerts and caps the selection to the first 10', async () => {
			apiFetch.mockResolvedValue([]);

			const EditComponent = edit;
			render(<EditComponent {...baseProps} />);
			await waitFor(() => expect(apiFetch).toHaveBeenCalled());

			fireEvent.click(screen.getByTestId('category-change-many'));

			expect(alertSpy).toHaveBeenCalledWith(
				expect.stringContaining('up to 10 categories'),
			);

			expect(baseProps.setAttributes).toHaveBeenCalledWith(
				expect.objectContaining({
					selectedCategroyId: [
						'1',
						'2',
						'3',
						'4',
						'5',
						'6',
						'7',
						'8',
						'9',
						'10',
					],
				}),
			);

			await waitFor(() => {
				const postCalls = apiFetch.mock.calls.filter(([opts]) =>
					opts.path.includes('/wp/v2/posts?categories='),
				);
				expect(postCalls).toHaveLength(10);
			});
		});

		test('selecting 10 or fewer categories does not trigger the alert', async () => {
			apiFetch.mockResolvedValue([]);

			const EditComponent = edit;
			render(<EditComponent {...baseProps} />);
			await waitFor(() => expect(apiFetch).toHaveBeenCalled());

			fireEvent.click(screen.getByTestId('category-change'));

			expect(alertSpy).not.toHaveBeenCalled();
		});
	});

	describe('loading indicator', () => {
		test('shows a loading message while posts are being fetched, then hides it', async () => {
			const resolvers = [];
			apiFetch.mockImplementation(({ path }) => {
				if (path.includes('/wp/v2/posts?categories=')) {
					return new Promise((resolve) => {
						resolvers.push(resolve);
					});
				}
				return Promise.resolve([]);
			});

			const propsWithCategories = {
				...baseProps,
				attributes: {
					...baseProps.attributes,
					categories: mockCategories,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategories} />);

			fireEvent.click(screen.getByTestId('category-change'));

			expect(await screen.findByText('Loading posts…')).toBeInTheDocument();
			await waitFor(() => expect(resolvers.length).toBe(2));

			resolvers[0](mockPostsCategory1);
			resolvers[1](mockPostsCategory2);

			await waitFor(() => {
				expect(screen.queryByText('Loading posts…')).not.toBeInTheDocument();
			});
		});

		test('hides the loading message when the fetch fails', async () => {
			apiFetch
				.mockResolvedValueOnce([]) // categories fetch
				.mockRejectedValueOnce(new Error('boom'));

			const propsWithCategories = {
				...baseProps,
				attributes: {
					...baseProps.attributes,
					categories: mockCategories,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategories} />);

			fireEvent.click(screen.getByTestId('category-change'));

			await waitFor(() => {
				expect(screen.queryByText('Loading posts…')).not.toBeInTheDocument();
			});
		});

		test('a stale error (superseded by a newer request) does not clear the loading indicator for the newer request', async () => {
			const resolvers = [];
			apiFetch.mockImplementation(({ path }) => {
				if (path.includes('/wp/v2/posts?categories=')) {
					return new Promise((resolve, reject) => {
						resolvers.push({ resolve, reject });
					});
				}
				return Promise.resolve([]);
			});

			const propsWithCategories = {
				...baseProps,
				attributes: {
					...baseProps.attributes,
					categories: mockCategories,
				},
			};

			const EditComponent = edit;
			render(<EditComponent {...propsWithCategories} />);

			// First (soon to be stale) category change.
			fireEvent.click(screen.getByTestId('category-change'));
			await waitFor(() => expect(resolvers.length).toBe(2));
			const stale = resolvers.splice(0, 2);

			// Second (fresh) category change fired before the first resolves.
			fireEvent.click(screen.getByTestId('category-change'));
			await waitFor(() => expect(resolvers.length).toBe(2));

			expect(screen.getByText('Loading posts…')).toBeInTheDocument();

			// The older request rejects - since it's stale, it must NOT clear
			// the loading indicator for the still-in-flight newer request.
			stale[0].reject(new Error('stale request failed'));
			stale[1].reject(new Error('stale request failed'));

			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(screen.getByText('Loading posts…')).toBeInTheDocument();
		});
	});
});
