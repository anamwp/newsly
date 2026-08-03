module.exports = {
	content: ['./src/**/*.php', './src/**/*.js', './assets/scss/**/*.scss'],
	theme: {
		extend: {
			colors: {}, // Extend Tailwind's default colors
			fontFamily: {
				poppins: 'Poppins, sans-serif',
			}, // Extend Tailwind's default font families
		},
	},
};
