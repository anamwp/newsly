module.exports = {
	syntax: 'postcss-scss',
	plugins: {
		'postcss-import': {},
		'postcss-nested': {},
		'tailwindcss/nesting': 'postcss-nesting',
		tailwindcss: {
			config: './tailwind.config.js',
		},
		autoprefixer: {},
	},
};
