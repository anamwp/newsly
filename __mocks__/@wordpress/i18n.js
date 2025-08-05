module.exports = {
	__: jest.fn((text) => text),
	_x: jest.fn((text) => text),
	_n: jest.fn((single, plural, number) => (number === 1 ? single : plural)),
	sprintf: jest.fn((format, ...args) => format),
};
