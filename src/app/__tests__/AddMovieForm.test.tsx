import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddMovieForm from "@/app/components/AddMovieForm";
import { vi } from "vitest";
import React from "react";

describe("AddMovieForm", () => {
	test("renders the form with all required fields", () => {
		render(<AddMovieForm onAdd={() => {}} />);

		expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/Enter genres/)).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Rating (1-10)")).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText("Description (optional)")
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Add Movie" })
		).toBeInTheDocument();
	});
});
