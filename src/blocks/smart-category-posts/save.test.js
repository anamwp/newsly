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

jest.mock('./components', () => {
	const React = require('react');
	return jest.fn(({ catArr }) =>
		React.createElement(
			'div',
			{
				'data-testid': 'post-category',
				'data-cat-count': catArr ? catArr.length : 0,
			},
			'Categories',
		),
	);
});

jest.mock('./getFeaturedImage', () => {
	const React = require('react');
	return function MockGetFeaturedImage() {
		return React.createElement('div', { 'data-testid': 'featured-image' });
	};
});

describe('Smart Category Posts Save Component', () => {
	const mockPosts = [
		{
			id: 1,
			title: { rendered: 'Post One' },
			excerpt: { rendered: '<p>Excerpt One</p>' },
			categories: [1, 2],
			featured_media: 0,
			link: '#',
		},
		{
			id: 2,
			title: { rendered: 'Post Two' },
			excerpt: { rendered: '<p>Excerpt Two</p>' },
			categories: [3],
			featured_media: 0,
			link: '#',
		},
	];

	const mockCategories = [
		{ label: 'Tech', value: 1, slug: 'tech' },
		{ label: 'News', value: 2, slug: 'news' },
	];

	const baseProps = {
		attributes: {
			categories: mockCategories,
			fetchedPosts: mockPosts,
			showCategory: true,
			showExcerpt: true,
		},
	};

	let consoleLogSpy;

	beforeEach(() => {
		jest.clearAllMocks();
		consoleLogSpy = jest
			.spyOn(global.console, 'log')
			.mockImplementation(() => {});
	});

	afterEach(() => {
		if (consoleLogSpy) {
			consoleLogSpy.mockClear();
			consoleLogSpy.mockRestore();
		}
	});

	test('renders wrapper and calls useBlockProps.save', () => {
		const { useBlockProps } = require('@wordpress/block-editor');
		const SaveComponent = save;
		const { container } = render(<SaveComponent {...baseProps} />);

		expect(useBlockProps.save).toHaveBeenCalled();
		expect(container.firstChild).toBeInTheDocument();
	});

	test('renders category tabs when categories exist', () => {
		const SaveComponent = save;
		render(<SaveComponent {...baseProps} />);

		expect(screen.getByText('Tech')).toBeInTheDocument();
		expect(screen.getByText('News')).toBeInTheDocument();
	});

	test('renders post cards with titles', () => {
		const SaveComponent = save;
		render(<SaveComponent {...baseProps} />);

		expect(screen.getByText('Post One')).toBeInTheDocument();
		expect(screen.getByText('Post Two')).toBeInTheDocument();
	});

	test('renders categories and excerpts when toggles are true', () => {
		const SaveComponent = save;
		render(<SaveComponent {...baseProps} />);

		expect(screen.getAllByTestId('post-category')).toHaveLength(2);
		expect(screen.getByText('Excerpt One')).toBeInTheDocument();
		expect(screen.getByText('Excerpt Two')).toBeInTheDocument();
	});

	test('does not render categories when showCategory is false', () => {
		const SaveComponent = save;
		render(
			<SaveComponent
				attributes={{
					...baseProps.attributes,
					showCategory: false,
				}}
			/>,
		);

		expect(screen.queryByTestId('post-category')).not.toBeInTheDocument();
	});

	test('does not render excerpts when showExcerpt is false', () => {
		const SaveComponent = save;
		render(
			<SaveComponent
				attributes={{
					...baseProps.attributes,
					showExcerpt: false,
				}}
			/>,
		);

		expect(screen.queryByText('Excerpt One')).not.toBeInTheDocument();
		expect(screen.queryByText('Excerpt Two')).not.toBeInTheDocument();
	});

	test('renders empty state when no posts', () => {
		const SaveComponent = save;
		const { container } = render(
			<SaveComponent
				attributes={{
					...baseProps.attributes,
					fetchedPosts: [],
				}}
			/>,
		);

		expect(container.querySelectorAll('.card')).toHaveLength(0);
	});

	test('renders only All tab when categories are empty', () => {
		const SaveComponent = save;
		render(
			<SaveComponent
				attributes={{
					...baseProps.attributes,
					categories: [],
				}}
			/>,
		);

		expect(screen.getByText('All')).toBeInTheDocument();
		expect(screen.queryByText('Tech')).not.toBeInTheDocument();
	});
});
