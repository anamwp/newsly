/**
 * Regression test for a critical production bug: a component wrapped in
 * React.memo() and used inside save() serializes to an EMPTY string via
 * @wordpress/element's renderToString - the actual mechanism WordPress uses
 * to persist block markup into post_content.
 *
 * This is invisible in the editor (client-side React) and in jsdom /
 * @testing-library/react unit tests (also client-side React) - both use a
 * different render path than the real save() → post_content pipeline. Only
 * @wordpress/element's own renderToString reproduces it, so this test uses
 * the REAL renderToString/createElement and the REAL GSPostCard component
 * (not mocked), unlike save.test.js.
 *
 * See workflow.md and tests/e2e/featured-posts-e2e-audit.md (FPE2E-01) for
 * the full incident writeup - the same shared component (GSPostCard here,
 * GSPostCardOverlay for featured-posts/latest-posts) caused every published
 * block using it to render an empty <div> on the frontend.
 *
 * IMPORTANT: this repo has a project-wide global mock at
 * __mocks__/@wordpress/element.js that Jest auto-applies to EVERY test file
 * (no jest.mock() call needed - it's Jest's automatic node_modules mock
 * convention). That mock strips out createElement/renderToString entirely,
 * which is itself part of why this bug was invisible to the whole unit test
 * suite, not just the e2e spec: no test could exercise the real SSR path
 * without explicitly bypassing it. jest.requireActual() below does that.
 */

import save from './save';
import GSPostCard from '../components/GSPostCard';

const { renderToString, createElement } = jest.requireActual(
	'@wordpress/element',
);

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

describe('Category Posts Save Component - frontend (SSR) serialization', () => {
	const mockPostsCategory1 = [
		{
			id: 11,
			title: { rendered: 'Cat 1 Post' },
			excerpt: { rendered: '<p>Excerpt 1</p>' },
			categories: [1],
			featured_media: 0,
			link: '#',
			_embedded: {
				'wp:featuredmedia': [],
				'wp:term': [[]],
			},
		},
	];

	const baseProps = {
		attributes: {
			layout: 'grid',
			postColumn: 3,
			postsToShow: 2,
			selectedCategories: [{ id: 1, label: 'Tech' }],
			activeTab: 1,
			allCategoryPosts: { 1: mockPostsCategory1 },
		},
	};

	test('produces non-empty HTML through the real @wordpress/element renderToString', () => {
		const html = renderToString(createElement(save, baseProps));

		expect(html.length).toBeGreaterThan(0);
		expect(html).toContain('Cat 1 Post');
	});

	test('GSPostCard alone renders non-empty HTML through renderToString', () => {
		const html = renderToString(
			createElement(GSPostCard, {
				data: mockPostsCategory1[0],
				parent: baseProps,
			}),
		);

		expect(html.length).toBeGreaterThan(0);
		expect(html).toContain('Cat 1 Post');
	});

	test('the shared GSPostCard component is not wrapped in React.memo (memo silently breaks renderToString)', () => {
		expect(GSPostCard.$$typeof).not.toBe(Symbol.for('react.memo'));
	});
});
