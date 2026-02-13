const React = require('react');

export const MockGSPostCardOverlay = function ({ data, parent }) {
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
