const React = require('react');

module.exports = function MockGSPostCardOverlay({ data, parent }) {
	return React.createElement('div', { 
		'data-testid': 'post-card',
		'data-post-id': data ? data.id : '',
		'data-post-title': data ? data.title.rendered : ''
	}, data ? data.title.rendered : '');
};
