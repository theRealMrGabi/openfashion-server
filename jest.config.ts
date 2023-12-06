import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
	preset: 'ts-jest',
	clearMocks: true,
	collectCoverage: false,
	coverageDirectory: 'coverage',
	setupFilesAfterEnv: ['./test/setup.ts'],
	testEnvironment: 'node',
	verbose: true,
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	}
}

export default config
