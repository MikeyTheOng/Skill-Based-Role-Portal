module.exports = {
    transform: {
      '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
      '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    testEnvironment: 'jest-environment-jsdom',
    injectGlobals: true,
    setupFilesAfterEnv: ['./jest.setup.js'],
};