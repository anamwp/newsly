/**
 * @jest-environment jsdom
 *
 * Regression coverage for a reported bug: "select multiple categories works
 * the first time, but changing the category selection afterwards makes the
 * frontend look empty." This exercises the full edit() -> setAttributes ->
 * save() pipeline through the REAL @wordpress/element renderToString (the
 * same mechanism WordPress uses to persist post_content), the same way
 * save.ssr-regression.test.js does for the React.memo bug.
 *
 * Each scenario drives the real edit.js component with a stateful harness
 * (mirroring how the block editor holds attributes) through a category
 * change, then feeds the resulting attributes through the real save().
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { useState } from 'react';
import edit from './edit';
import save from './save';

jest.mock('@wordpress/block-editor', () => {
	const {
		wordPressBlockEditorMock,
	} = require('../__mocks__/wordpress-block-editor');
	return {
		...wordPressBlockEditorMock,
		useBlockProps: Object.assign(
			jest.fn((props = {}) => props),
			{ save: jest.fn((props = {}) => props) },
		),
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

jest.mock('./sidebarControl', () => {
	const React = require('react');
	return function MockSidebarControl({ handleCategoryChange }) {
		return React.createElement(
			'div',
			{ 'data-testid': 'sidebar-control' },
			[
				React.createElement(
					'button',
					{
						key: 'sel-ab',
						'data-testid': 'select-ab',
						onClick: () => handleCategoryChange(['1', '2']),
					},
					'Select A+B',
				),
				React.createElement(
					'button',
					{
						key: 'sel-cd',
						'data-testid': 'select-cd',
						onClick: () => handleCategoryChange(['3', '4']),
					},
					'Select C+D',
				),
				// Mirrors the real native <select multiple> interaction: a plain
				// click on one option replaces the selection (onChange(['3'])),
				// then a ctrl/cmd+click on another adds to it
				// (onChange(['3','4'])) - two rapid, overlapping onChange calls
				// for what the user perceives as a single action.
				React.createElement(
					'button',
					{
						key: 'sel-c-then-cd',
						'data-testid': 'select-c-then-cd',
						onClick: () => {
							handleCategoryChange(['3']);
							handleCategoryChange(['3', '4']);
						},
					},
					'Click C then ctrl-click D',
				),
				React.createElement(
					'button',
					{
						key: 'sel-none',
						'data-testid': 'select-none',
						onClick: () => handleCategoryChange([]),
					},
					'Deselect All',
				),
			],
		);
	};
});

jest.mock('../components/GSPostCard', () => {
	const React = require('react');
	return function MockGSPostCard({ data }) {
		return React.createElement(
			'div',
			{ 'data-testid': 'post-card' },
			data.title.rendered,
		);
	};
});

import apiFetch from '@wordpress/api-fetch';

const { renderToString, createElement } = jest.requireActual(
	'@wordpress/element',
);

const mockPost = (id, categoryId, label) => ({
	id,
	title: { rendered: `${label} Post` },
	excerpt: { rendered: '' },
	categories: [categoryId],
	featured_media: 0,
	link: '#',
});

function Harness({ initialAttributes, onSnapshot }) {
	const [attributes, setAttributesState] = useState(initialAttributes);
	const setAttributes = (patch) => {
		setAttributesState((prev) => {
			const next = { ...prev, ...patch };
			onSnapshot(next);
			return next;
		});
	};
	const EditComponent = edit;
	return (
		<EditComponent attributes={attributes} setAttributes={setAttributes} />
	);
}

const baseInitialAttributes = {
	layout: 'grid',
	postColumn: 3,
	postsToShow: 24,
	categories: [
		{ label: 'A', value: '1' },
		{ label: 'B', value: '2' },
		{ label: 'C', value: '3' },
		{ label: 'D', value: '4' },
	],
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
};

function expectSaveOutputToContainPosts(attributes, expectedTitles) {
	const html = renderToString(createElement(save, { attributes }));
	expect(html.length).toBeGreaterThan(0);
	expectedTitles.forEach((title) => {
		expect(html).toContain(title);
	});
	return html;
}

describe('Category Post - category change does not produce an empty frontend', () => {
	let consoleErrorSpy;

	beforeEach(() => {
		apiFetch.mockImplementation(({ path }) => {
			if (path.includes('categories=1'))
				return Promise.resolve([mockPost(101, 1, 'A')]);
			if (path.includes('categories=2'))
				return Promise.resolve([mockPost(102, 2, 'B')]);
			if (path.includes('categories=3'))
				return Promise.resolve([mockPost(103, 3, 'C')]);
			if (path.includes('categories=4'))
				return Promise.resolve([mockPost(104, 4, 'D')]);
			return Promise.resolve([]);
		});
		// edit.js triggers a harmless "tabindex" DOM prop warning from jsdom
		// unrelated to this regression - silence it so @wordpress/jest-console
		// doesn't fail these tests on it.
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	test('first category selection produces non-empty save() output', async () => {
		let latest = null;
		render(
			<Harness
				initialAttributes={baseInitialAttributes}
				onSnapshot={(attrs) => (latest = attrs)}
			/>,
		);

		fireEvent.click(screen.getByTestId('select-ab'));
		await waitFor(() =>
			expect(Object.keys(latest.allCategoryPosts).sort()).toEqual([
				'1',
				'2',
			]),
		);

		expectSaveOutputToContainPosts(latest, ['A Post']);
	});

	test('activeTab is stored as a real Number, matching its "number" type in block.json (prevents "Attempt Block Recovery")', async () => {
		// Regression test for a live-verified bug: block.json declares
		// activeTab as type "number", but handlePostsByCategory used to store
		// the raw string straight from the <select> control. WordPress's
		// block-attribute validation discards a stored value that doesn't
		// match its declared type and silently falls back to the schema
		// default (null) when the block is re-parsed on reload. That made
		// save() regenerate the panel as inactive/hidden while the originally
		// stored markup had it active - a mismatch Gutenberg flags as invalid
		// content ("Attempt Block Recovery"), even though every other part of
		// the markup (posts, images, categories) was byte-identical.
		let latest = null;
		render(
			<Harness
				initialAttributes={baseInitialAttributes}
				onSnapshot={(attrs) => (latest = attrs)}
			/>,
		);

		fireEvent.click(screen.getByTestId('select-ab'));
		await waitFor(() =>
			expect(Object.keys(latest.allCategoryPosts).sort()).toEqual([
				'1',
				'2',
			]),
		);

		expect(latest.activeTab).toBe(1);
		expect(typeof latest.activeTab).toBe('number');

		// Simulate WordPress re-parsing the block: a "number"-typed attribute
		// that was somehow stored as a string gets reset to the schema
		// default (null) on reload. Confirm save() with the CORRECT (Number)
		// value renders the panel active - proving the fix actually matters.
		const htmlWithNumber = renderToString(
			createElement(save, { attributes: latest }),
		);
		expect(htmlWithNumber).toContain('active grid');
		expect(htmlWithNumber).toContain('aria-selected="true"');

		const htmlIfTypeWereWrongAndDiscarded = renderToString(
			createElement(save, {
				attributes: { ...latest, activeTab: null },
			}),
		);
		expect(htmlIfTypeWereWrongAndDiscarded).not.toContain('active grid');
		expect(htmlIfTypeWereWrongAndDiscarded).toContain(
			'aria-selected="false"',
		);
	});

	test('changing the category selection afterwards still produces non-empty save() output', async () => {
		let latest = null;
		render(
			<Harness
				initialAttributes={baseInitialAttributes}
				onSnapshot={(attrs) => (latest = attrs)}
			/>,
		);

		fireEvent.click(screen.getByTestId('select-ab'));
		await waitFor(() =>
			expect(Object.keys(latest.allCategoryPosts).sort()).toEqual([
				'1',
				'2',
			]),
		);

		fireEvent.click(screen.getByTestId('select-cd'));
		await waitFor(() =>
			expect(Object.keys(latest.allCategoryPosts).sort()).toEqual([
				'3',
				'4',
			]),
		);

		expect(latest.activeTab).toBe(3);
		expectSaveOutputToContainPosts(latest, ['C Post']);
	});

	test('reopening an already-saved post and then changing category still produces non-empty save() output', async () => {
		let latest = null;
		const alreadySavedAttributes = {
			...baseInitialAttributes,
			selectedCategroyId: ['1', '2'],
			selectedCategories: [
				{ id: 1, label: 'A' },
				{ id: 2, label: 'B' },
			],
			fetchedPosts: [[mockPost(101, 1, 'A')]],
			allCategoryPosts: {
				1: [mockPost(101, 1, 'A')],
				2: [mockPost(102, 2, 'B')],
			},
			activeTab: 1,
			selectedPostId: 101,
		};

		render(
			<Harness
				initialAttributes={alreadySavedAttributes}
				onSnapshot={(attrs) => (latest = attrs)}
			/>,
		);

		fireEvent.click(screen.getByTestId('select-cd'));
		await waitFor(() =>
			expect(Object.keys(latest.allCategoryPosts).sort()).toEqual([
				'3',
				'4',
			]),
		);

		expectSaveOutputToContainPosts(latest, ['C Post']);
	});

	test('realistic native multi-select interaction (rapid overlapping onChange calls) still produces non-empty save() output', async () => {
		let latest = null;
		render(
			<Harness
				initialAttributes={baseInitialAttributes}
				onSnapshot={(attrs) => (latest = attrs)}
			/>,
		);

		fireEvent.click(screen.getByTestId('select-c-then-cd'));
		await waitFor(() =>
			expect(Object.keys(latest.allCategoryPosts).sort()).toEqual([
				'3',
				'4',
			]),
		);

		expect(latest.activeTab).toBe(3);
		expectSaveOutputToContainPosts(latest, ['C Post']);
	});

	test('deselecting all categories clears stale allCategoryPosts instead of leaving it behind', async () => {
		let latest = null;
		render(
			<Harness
				initialAttributes={baseInitialAttributes}
				onSnapshot={(attrs) => (latest = attrs)}
			/>,
		);

		fireEvent.click(screen.getByTestId('select-ab'));
		await waitFor(() =>
			expect(Object.keys(latest.allCategoryPosts).sort()).toEqual([
				'1',
				'2',
			]),
		);

		fireEvent.click(screen.getByTestId('select-none'));

		expect(latest.allCategoryPosts).toEqual({});
		expect(latest.activeTab).toBeNull();
		expect(latest.selectedCategories).toEqual([]);
	});
});
