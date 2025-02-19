module.exports = {
	preset: '@wordpress/jest-preset-default',
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
	},
	// setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
	setupFilesAfterEnv: ['<rootDir>/jest-setup.js'], // Change this line
	moduleNameMapper: {
		'\\.(css|scss)$': 'identity-obj-proxy', // Ignore CSS imports in tests
	},
	testPathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/dist/',
		'<rootDir>/build/',
	],
};
