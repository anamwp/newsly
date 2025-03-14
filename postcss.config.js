module.exports = {
	syntax: 'postcss-scss',
	plugins: {
		'postcss-import': {},
		// 'postcss-nested': {},
		// 'tailwindcss/nesting': 'postcss-nesting',
		'tailwindcss/nesting': {},
		// tailwindcss: {
		// 	config: './tailwind.config.js',
		// },
		tailwindcss: require('tailwindcss'),
		autoprefixer: {},
	},
};
