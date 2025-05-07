export default {
	preset: "ts-jest", // Use ts-jest to handle TypeScript files
	testEnvironment: "node", // Set the test environment to Node.js
	transform: {
		"^.+\\.tsx?$": "ts-jest", // Transform TypeScript files using ts-jest
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1", // Adjust for your alias (if applicable)
	},
	transformIgnorePatterns: [
		"node_modules/(?!supertest)", // Ensure supertest is transformed if needed
	],
};
