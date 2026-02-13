export const wordPressDataMock = {
	useSelect: jest.fn(() => ({})),
	withSelect: jest.fn((selector) => (Component) => Component),
	select: jest.fn(() => ({})),
	dispatch: jest.fn(() => ({})),
	useDispatch: jest.fn(() => jest.fn()),
};
