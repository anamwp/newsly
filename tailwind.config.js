module.exports = {
	content: ['./src/**/*.php', './src/**/*.js'],
	theme: {
		extend: {
			colors: {}, // Extend Tailwind's default colors
			fontFamily: {
				roboto: 'Roboto, sans-serif',
				poppins: 'Poppins, sans-serif',
			}, // Extend Tailwind's default font families
		},
	},
};
