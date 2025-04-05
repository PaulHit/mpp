// jest.config.js
export default {
	testEnvironment: "jest-environment-jsdom",
	setupFilesAfterEnv: ["./jest.setup.js"],
	testPathIgnorePatterns: ["/node_modules/", "/.next/"],
	moduleDirectories: ["node_modules", "<rootDir>"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				useESM: true,
				tsconfig: "tsconfig.jest.json",
			},
		],
	},
	extensionsToTreatAsEsm: [".ts", ".tsx"],
};
