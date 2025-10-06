// Mock for @wordpress/api-fetch
const apiFetch = jest.fn();

module.exports = {
	__esModule: true,
	default: apiFetch,
	apiFetch: apiFetch,
};
