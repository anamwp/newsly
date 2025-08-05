module.exports = {
	useState: jest.requireActual('react').useState,
	useEffect: jest.requireActual('react').useEffect,
	useContext: jest.requireActual('react').useContext,
	useRef: jest.requireActual('react').useRef,
};
