/**
 * @jest-environment jsdom
 */

import { waitFor } from '@testing-library/react';

function setupDom() {
	document.body.innerHTML = `
		<div class="newsly__post_list_tab" data-postid="42">
			<a href="#" class="tablinks active" data-cat-slug="">All</a>
			<a href="#" class="tablinks" data-cat-slug="tech">Tech</a>
			<a href="#" class="tablinks" data-cat-slug="sports">Sports</a>
			<div class="post-list-tab-post-content">initial</div>
		</div>
	`;
}

function fireDomContentLoaded() {
	document.dispatchEvent(
		new Event('DOMContentLoaded', { bubbles: true, cancelable: true }),
	);
}

describe('Post Lists Tab - view.js (category tab pagination)', () => {
	beforeEach(() => {
		jest.resetModules();
		setupDom();
		global.anamajaxpagination = {
			ajaxurl: 'https://example.test/wp-admin/admin-ajax.php',
			newsly_ajax_nonce: 'nonce-123',
		};
		global.fetch = jest.fn(() =>
			Promise.resolve({ text: () => Promise.resolve('<p>New posts</p>') }),
		);
	});

	afterEach(() => {
		delete global.anamajaxpagination;
		delete global.fetch;
		document.body.innerHTML = '';
	});

	test('does nothing when the ajax pagination config is missing', () => {
		delete global.anamajaxpagination;

		require('./view.js');
		fireDomContentLoaded();

		document.querySelector('[data-cat-slug="tech"]').click();

		expect(global.fetch).not.toHaveBeenCalled();
	});

	test('ignores clicks on the tab that is already active', () => {
		require('./view.js');
		fireDomContentLoaded();

		document.querySelector('.tablinks.active').click();

		expect(global.fetch).not.toHaveBeenCalled();
	});

	test('fetches category posts via admin-ajax and swaps in the response html', async () => {
		require('./view.js');
		fireDomContentLoaded();

		const techTab = document.querySelector('[data-cat-slug="tech"]');
		techTab.click();

		expect(global.fetch).toHaveBeenCalledWith(
			'https://example.test/wp-admin/admin-ajax.php',
			expect.objectContaining({
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			}),
		);

		const [, options] = global.fetch.mock.calls[0];
		const body = new URLSearchParams(options.body);
		expect(body.get('action')).toBe('handle_category_post_content');
		expect(body.get('newslyAjaxNonce')).toBe('nonce-123');
		expect(body.get('catSlug')).toBe('tech');
		expect(body.get('postId')).toBe('42');

		await waitFor(() => {
			expect(
				document.querySelector('.post-list-tab-post-content').innerHTML,
			).toBe('<p>New posts</p>');
		});
		expect(techTab.classList.contains('active')).toBe(true);
		expect(
			document
				.querySelector('.post-list-tab-post-content')
				.classList.contains('opacity-50'),
		).toBe(false);
	});

	test('marks only the clicked tab as active and updates aria-selected', async () => {
		require('./view.js');
		fireDomContentLoaded();

		const allTab = document.querySelector('[data-cat-slug=""]');
		const techTab = document.querySelector('[data-cat-slug="tech"]');
		techTab.click();

		await waitFor(() => {
			expect(techTab.classList.contains('active')).toBe(true);
		});
		expect(allTab.classList.contains('active')).toBe(false);
		expect(techTab.getAttribute('aria-selected')).toBe('true');
		expect(allTab.getAttribute('aria-selected')).toBe('false');
	});

	test('adds a loading class while the request is in flight', () => {
		let resolveFetch;
		global.fetch = jest.fn(
			() =>
				new Promise((resolve) => {
					resolveFetch = resolve;
				}),
		);

		require('./view.js');
		fireDomContentLoaded();

		document.querySelector('[data-cat-slug="tech"]').click();

		expect(
			document
				.querySelector('.post-list-tab-post-content')
				.classList.contains('opacity-50'),
		).toBe(true);

		resolveFetch({ text: () => Promise.resolve('<p>done</p>') });
	});

	test('ignores a click on another tab while a request is already in flight', () => {
		let resolveFetch;
		global.fetch = jest.fn(
			() =>
				new Promise((resolve) => {
					resolveFetch = resolve;
				}),
		);

		require('./view.js');
		fireDomContentLoaded();

		const techTab = document.querySelector('[data-cat-slug="tech"]');
		const sportsTab = document.querySelector('[data-cat-slug="sports"]');

		techTab.click();
		expect(global.fetch).toHaveBeenCalledTimes(1);

		sportsTab.click();
		expect(global.fetch).toHaveBeenCalledTimes(1);

		resolveFetch({ text: () => Promise.resolve('<p>done</p>') });
	});

	test('falls back to an empty catSlug when the clicked tab has no data-cat-slug attribute', () => {
		document.body.innerHTML = `
			<div class="newsly__post_list_tab" data-postid="42">
				<a href="#" class="tablinks active" data-cat-slug="">All</a>
				<a href="#" class="tablinks" id="no-slug-tab">No Slug</a>
				<div class="post-list-tab-post-content">initial</div>
			</div>
		`;

		require('./view.js');
		fireDomContentLoaded();

		document.getElementById('no-slug-tab').click();

		const [, options] = global.fetch.mock.calls[0];
		const body = new URLSearchParams(options.body);
		expect(body.get('catSlug')).toBe('');
	});

	test('falls back to an empty postId when the block has no data-postid attribute', () => {
		document.body.innerHTML = `
			<div class="newsly__post_list_tab">
				<a href="#" class="tablinks active" data-cat-slug="">All</a>
				<a href="#" class="tablinks" data-cat-slug="tech">Tech</a>
				<div class="post-list-tab-post-content">initial</div>
			</div>
		`;

		require('./view.js');
		fireDomContentLoaded();

		document.querySelector('[data-cat-slug="tech"]').click();

		const [, options] = global.fetch.mock.calls[0];
		const body = new URLSearchParams(options.body);
		expect(body.get('postId')).toBe('');
	});

	test('leaves the previously rendered posts in place when the fetch fails', async () => {
		global.fetch = jest.fn(() => Promise.reject(new Error('network down')));

		require('./view.js');
		fireDomContentLoaded();

		document.querySelector('[data-cat-slug="tech"]').click();

		await waitFor(() => {
			expect(
				document
					.querySelector('.post-list-tab-post-content')
					.classList.contains('opacity-50'),
			).toBe(false);
		});
		expect(
			document.querySelector('.post-list-tab-post-content').innerHTML,
		).toBe('initial');
	});
});
