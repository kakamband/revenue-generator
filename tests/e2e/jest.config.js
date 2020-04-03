module.exports = {
	rootDir: '../../',
	...require( '@wordpress/scripts/config/jest-e2e.config' ),
	transform: {
		'^.+\\.[jt]sx?$': '<rootDir>/node_modules/@wordpress/scripts/config/babel-transform',
	},
	transformIgnorePatterns: [
		'node_modules',
	],
	setupFilesAfterEnv: [
		'<rootDir>/tests/e2e/config/bootstrap.js',
		'@wordpress/jest-puppeteer-axe',
		'expect-puppeteer',
	],
	testPathIgnorePatterns: [
		'<rootDir>/.git',
		'<rootDir>/node_modules',
		'<rootDir>/bin',
		'<rootDir>/assets',
		'<rootDir>/vendor',
	],
	reporters: [ [ 'jest-silent-reporter', { useDots: true } ] ],
	testSequencer : '<rootDir>/tests/e2e/config/jest-custom-sequencer.js'
};
