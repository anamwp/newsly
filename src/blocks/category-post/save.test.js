/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import save from './save';

jest.mock(
	'@wordpress/block-editor',
	() =>
		require('../__mocks__/wordpress-block-editor')
			.wordPressBlockEditorSaveMock,
);

jest.mock(
	'@wordpress/i18n',
	() => require('../__mocks__/wordpress-i18n').wordPressI18nMock,
);

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

describe('Category Posts Save Component', () => {
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
		{ id: 1, label: 'Tech' },
		{ id: 2, label: 'News' },
	];

	const baseProps = {
		attributes: {
			layout: 'grid',
			postColumn: 3,
			postsToShow: 2,
			selectedCategories: mockCategories,
			activeTab: 1,
			allCategoryPosts: {
				1: mockPostsCategory1,
				2: mockPostsCategory2,
			},
		},
	};

	let consoleLogSpy;
	let consoleErrorSpy;

	beforeEach(() => {
		jest.clearAllMocks();
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

	test('applies block props and data attributes', () => {
		const SaveComponent = save;
		const { container } = render(<SaveComponent {...baseProps} />);
		const wrapper = container.firstChild;

		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveAttribute('data-categories');
		expect(wrapper).toHaveAttribute('data-active-tab', '1');
		expect(wrapper).toHaveAttribute('data-posts-to-show', '2');
		expect(wrapper).toHaveAttribute('data-post-column', '3');
	});

	test('renders category summary and tabs', () => {
		const SaveComponent = save;
		render(<SaveComponent {...baseProps} />);

		expect(screen.getByText('2 Categories Selected')).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'Tech' })).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: 'News' })).toBeInTheDocument();
	});

	test('marks active tab with aria-selected=true', () => {
		const SaveComponent = save;
		render(<SaveComponent {...baseProps} />);

		const techTab = screen.getByRole('tab', { name: 'Tech' });
		const newsTab = screen.getByRole('tab', { name: 'News' });

		expect(techTab).toHaveAttribute('aria-selected', 'true');
		expect(newsTab).toHaveAttribute('aria-selected', 'false');
	});

	test('renders posts for each category with GSPostCard', () => {
		const SaveComponent = save;
		render(<SaveComponent {...baseProps} />);

		const postCards = screen.getAllByTestId('post-card');
		expect(postCards).toHaveLength(2);
		expect(screen.getByText('Cat 1 Post')).toBeInTheDocument();
		expect(screen.getByText('Cat 2 Post')).toBeInTheDocument();
	});

	test('renders single category label when only one selected', () => {
		const propsWithSingle = {
			attributes: {
				...baseProps.attributes,
				selectedCategories: [{ id: 1, label: 'Tech' }],
				allCategoryPosts: { 1: mockPostsCategory1 },
				activeTab: 1,
			},
		};

		const SaveComponent = save;
		render(<SaveComponent {...propsWithSingle} />);
		expect(screen.getAllByText('Tech').length).toBeGreaterThan(0);
	});

	test('renders no tabs when no categories selected', () => {
		const propsNoCats = {
			attributes: {
				...baseProps.attributes,
				selectedCategories: [],
				allCategoryPosts: {},
				activeTab: null,
			},
		};

		const SaveComponent = save;
		const { container } = render(<SaveComponent {...propsNoCats} />);
		expect(
			container.querySelector('[role="tablist"]'),
		).not.toBeInTheDocument();
	});
});
