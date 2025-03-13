module.exports = {
	content: ['./src/**/*.php', './src/**/*.js', './assets/scss/**/*.scss'],
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
