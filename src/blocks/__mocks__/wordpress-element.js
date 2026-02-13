export const wordPressElementMock = {
	RawHTML: ({ children }) => <div>{children}</div>,
	useState: jest.requireActual('react').useState,
	useRef: jest.requireActual('react').useRef,
	useEffect: jest.requireActual('react').useEffect,
	useContext: jest.fn(),
};
