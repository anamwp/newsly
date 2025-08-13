const React = require('react');

module.exports = {
	useState: jest.requireActual('react').useState,
	useEffect: jest.requireActual('react').useEffect,
	useContext: jest.requireActual('react').useContext,
	useRef: jest.requireActual('react').useRef,
	RawHTML: jest.fn(({ children }) =>
		React.createElement('div', { 'data-testid': 'raw-html' }, children)
	),
};
