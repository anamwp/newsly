/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import GSPostCard from './GSPostCard';

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));

function makePostData(overrides = {}) {
	return {
		title: { rendered: 'Hello World' },
		link: 'https://example.test/hello-world',
		excerpt: { rendered: '<p>An excerpt</p>' },
		featured_media: 0,
		_embedded: {},
		...overrides,
	};
}

function makeParent(attributes = {}) {
	return {
		attributes: {
			showFeaturedImage: false,
			showCategory: false,
			showExcerpt: false,
			showFeaturedExcerpt: false,
			layout: 'card',
			...attributes,
		},
	};
}

describe('GSPostCard', () => {
	test('renders the featured image when showFeaturedImage is on and the post has one', () => {
		const postData = makePostData({
			featured_media: 12,
			_embedded: {
				'wp:featuredmedia': [
					{ source_url: 'https://example.test/img.jpg', alt_text: 'Alt text' },
				],
			},
		});
		const parent = makeParent({ showFeaturedImage: true });

		render(<GSPostCard data={postData} parent={parent} />);

		const img = screen.getByRole('img', { name: 'Alt text' });
		expect(img).toHaveAttribute('src', 'https://example.test/img.jpg');
	});

	test('falls back to a generated alt text when the media has none', () => {
		const postData = makePostData({
			featured_media: 12,
			_embedded: {
				'wp:featuredmedia': [{ source_url: 'https://example.test/img.jpg' }],
			},
		});
		const parent = makeParent({ showFeaturedImage: true });

		render(<GSPostCard data={postData} parent={parent} />);

		expect(
			screen.getByRole('img', { name: 'Featured Image for Hello World' }),
		).toBeInTheDocument();
	});

	test('shows the "no featured image" message when showFeaturedImage is on but the post has none', () => {
		const postData = makePostData({ featured_media: 0 });
		const parent = makeParent({ showFeaturedImage: true });

		render(<GSPostCard data={postData} parent={parent} />);

		expect(screen.getByText('No featured image found')).toBeInTheDocument();
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});

	test('renders neither image branch when showFeaturedImage is off', () => {
		const postData = makePostData({
			featured_media: 12,
			_embedded: {
				'wp:featuredmedia': [{ source_url: 'https://example.test/img.jpg' }],
			},
		});
		const parent = makeParent({ showFeaturedImage: false });

		render(<GSPostCard data={postData} parent={parent} />);

		expect(screen.queryByRole('img')).not.toBeInTheDocument();
		expect(
			screen.queryByText('No featured image found'),
		).not.toBeInTheDocument();
	});

	test('renders a category link per term when showCategory is on and terms exist', () => {
		const postData = makePostData({
			_embedded: {
				'wp:term': [
					[
						{ name: 'Tech', link: 'https://example.test/cat/tech' },
						{ name: 'News', link: 'https://example.test/cat/news' },
					],
				],
			},
		});
		const parent = makeParent({ showCategory: true });

		render(<GSPostCard data={postData} parent={parent} />);

		const techLink = screen.getByRole('link', {
			name: 'View posts in Tech category',
		});
		expect(techLink).toHaveAttribute('href', 'https://example.test/cat/tech');
		expect(
			screen.getByRole('link', { name: 'View posts in News category' }),
		).toBeInTheDocument();
	});

	test('renders no category links when the post has no terms', () => {
		const postData = makePostData();
		const parent = makeParent({ showCategory: true });

		render(<GSPostCard data={postData} parent={parent} />);

		expect(
			screen.queryByLabelText(/View posts in/),
		).not.toBeInTheDocument();
	});

	test('renders no category links when showCategory is off, even if terms exist', () => {
		const postData = makePostData({
			_embedded: {
				'wp:term': [[{ name: 'Tech', link: 'https://example.test/cat/tech' }]],
			},
		});
		const parent = makeParent({ showCategory: false });

		render(<GSPostCard data={postData} parent={parent} />);

		expect(
			screen.queryByLabelText(/View posts in/),
		).not.toBeInTheDocument();
	});

	test('always renders the title link', () => {
		const postData = makePostData();
		const parent = makeParent();

		render(<GSPostCard data={postData} parent={parent} />);

		const titleLink = screen.getByRole('link', {
			name: 'Read more about Hello World',
		});
		expect(titleLink).toHaveAttribute('href', postData.link);
	});

	test('renders the excerpt when showExcerpt is on and layout is card', () => {
		const postData = makePostData();
		const parent = makeParent({ showExcerpt: true, layout: 'card' });

		render(<GSPostCard data={postData} parent={parent} />);

		expect(screen.getByText('An excerpt')).toBeInTheDocument();
	});

	test('does not render the card excerpt when layout is not card', () => {
		const postData = makePostData();
		const parent = makeParent({ showExcerpt: true, layout: 'grid' });

		render(<GSPostCard data={postData} parent={parent} />);

		expect(screen.queryByText('An excerpt')).not.toBeInTheDocument();
	});

	test('does not render the card excerpt when showExcerpt is off', () => {
		const postData = makePostData();
		const parent = makeParent({ showExcerpt: false, layout: 'card' });

		render(<GSPostCard data={postData} parent={parent} />);

		expect(screen.queryByText('An excerpt')).not.toBeInTheDocument();
	});

	test('renders the featured excerpt for the first grid item when showFeaturedExcerpt is on', () => {
		const postData = makePostData();
		const parent = makeParent({ layout: 'grid', showFeaturedExcerpt: true });

		render(
			<GSPostCard data={postData} parent={parent} numberKey={0} />,
		);

		expect(screen.getByText('An excerpt')).toBeInTheDocument();
	});

	test('does not render the featured excerpt for non-first grid items', () => {
		const postData = makePostData();
		const parent = makeParent({ layout: 'grid', showFeaturedExcerpt: true });

		render(
			<GSPostCard data={postData} parent={parent} numberKey={1} />,
		);

		expect(screen.queryByText('An excerpt')).not.toBeInTheDocument();
	});

	test('does not render the featured excerpt when showFeaturedExcerpt is off', () => {
		const postData = makePostData();
		const parent = makeParent({ layout: 'grid', showFeaturedExcerpt: false });

		render(
			<GSPostCard data={postData} parent={parent} numberKey={0} />,
		);

		expect(screen.queryByText('An excerpt')).not.toBeInTheDocument();
	});

	test('defaults numberKey to 0 when not passed', () => {
		const postData = makePostData();
		const parent = makeParent({ layout: 'grid', showFeaturedExcerpt: true });

		const { container } = render(<GSPostCard data={postData} parent={parent} />);

		expect(container.querySelector('[data-post-serial="0"]')).toBeInTheDocument();
		expect(screen.getByText('An excerpt')).toBeInTheDocument();
	});
});
