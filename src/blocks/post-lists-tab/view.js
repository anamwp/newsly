// Category tab pagination for the Post Lists Tab block.
// Scoped per `.newsly__post_list_tab` instance so multiple blocks on the
// same page don't share tab state, and fetches the matching posts via
// admin-ajax instead of pre-rendering every category up front.
document.addEventListener('DOMContentLoaded', function () {
	const blocks = document.querySelectorAll('.newsly__post_list_tab');

	blocks.forEach((block) => {
		const tabs = Array.from(block.querySelectorAll('.tablinks'));
		const content = block.querySelector('.post-list-tab-post-content');
		const postId = block.getAttribute('data-postid');

		if (tabs.length === 0 || !content || typeof anamajaxpagination === 'undefined') {
			return;
		}

		let isLoading = false;

		function setActiveTab(tab) {
			tabs.forEach((t) => {
				const active = t === tab;
				t.classList.toggle('active', active);
				t.classList.toggle('bg-slate-800', active);
				t.classList.toggle('text-white', active);
				t.classList.toggle('bg-slate-50', !active);
				t.classList.toggle('text-slate-800', !active);
				t.setAttribute('aria-selected', active ? 'true' : 'false');
			});
		}

		function fetchCategoryPosts(tab) {
			if (isLoading) {
				return;
			}
			isLoading = true;
			content.classList.add('opacity-50');

			const body = new URLSearchParams({
				action: 'handle_category_post_content',
				newslyAjaxNonce: anamajaxpagination.newsly_ajax_nonce,
				catSlug: tab.getAttribute('data-cat-slug') || '',
				postId: postId || '',
			});

			fetch(anamajaxpagination.ajaxurl, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body,
			})
				.then((response) => response.text())
				.then((html) => {
					content.innerHTML = html;
				})
				.catch(() => {
					// Leave the previously rendered posts in place on failure.
				})
				.finally(() => {
					isLoading = false;
					content.classList.remove('opacity-50');
				});
		}

		tabs.forEach((tab) => {
			tab.addEventListener('click', function (event) {
				event.preventDefault();
				if (tab.classList.contains('active')) {
					return;
				}
				setActiveTab(tab);
				fetchCategoryPosts(tab);
			});
		});
	});
});
