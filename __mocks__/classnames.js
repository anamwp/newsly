module.exports = jest.fn((...classes) => classes.filter(Boolean).join(' '));
