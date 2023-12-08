import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
	preset: 'ts-jest',
	clearMocks: true,
	collectCoverage: false,
	setupFilesAfterEnv: ['./test/setup.ts'],
	globalSetup: './test/globalSetup.ts',
	testEnvironment: 'node',
	verbose: true,
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/']
}

export default config
