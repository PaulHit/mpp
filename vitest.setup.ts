import "@testing-library/jest-dom";

vi.mock("uuid", () => ({
	v4: () => "test-uuid-123",
}));
