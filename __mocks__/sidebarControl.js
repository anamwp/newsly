const React = require('react');

module.exports = function MockSidebarControl({ 
	props, 
	categories, 
	handleNumberOfPostsChange, 
	handleCategoryChange,
	handleCategoryToggleControl,
	handleExcerptToggleControl,
	handleFeaturedImageToggleControl
}) {
	return React.createElement('div', { 'data-testid': 'sidebar-control' }, [
		React.createElement('select', {
			key: 'category-select',
			'data-testid': 'category-select',
			onChange: (e) => handleCategoryChange && handleCategoryChange(e.target.value),
		}, categories ? categories.map(cat => 
			React.createElement('option', { key: cat.value, value: cat.value }, cat.label)
		) : []),
		React.createElement('input', {
			key: 'number-input',
			'data-testid': 'number-input',
			type: 'number',
			defaultValue: props.attributes.numberOfPosts,
			onChange: (e) => handleNumberOfPostsChange && handleNumberOfPostsChange(parseInt(e.target.value)),
		}),
		React.createElement('button', {
			key: 'category-toggle',
			'data-testid': 'category-toggle',
			onClick: () => handleCategoryToggleControl && handleCategoryToggleControl(),
		}, 'Toggle Category'),
		React.createElement('button', {
			key: 'excerpt-toggle',
			'data-testid': 'excerpt-toggle',
			onClick: () => handleExcerptToggleControl && handleExcerptToggleControl(),
		}, 'Toggle Excerpt'),
		React.createElement('button', {
			key: 'featured-image-toggle',
			'data-testid': 'featured-image-toggle',
			onClick: () => handleFeaturedImageToggleControl && handleFeaturedImageToggleControl(),
		}, 'Toggle Featured Image'),
	]);
};
