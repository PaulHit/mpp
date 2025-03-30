import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MoviesPage from "./page";

describe("MoviesPage CRUD Operations", () => {
	// Test for rendering the page title
	test("renders the movie collection title", () => {
		render(<MoviesPage />);
		const titleElement = screen.getByText(/Movie Collection/i);
		expect(titleElement).toBeInTheDocument();
	});

	// Test for Create operation
	test("adds a new movie to the list", () => {
		render(<MoviesPage />);

		// Fill out the AddMovieForm
		const nameInput = screen.getByPlaceholderText("Name");
		const genreInput = screen.getByPlaceholderText(
			"Enter genres (press space or enter to add)"
		);
		const releaseDateInput = screen.getByPlaceholderText("Release Date");
		const ratingInput = screen.getByPlaceholderText("Rating (0-10)");
		const addButton = screen.getByText("Add Movie");

		// Simulate user input
		fireEvent.change(nameInput, { target: { value: "New Movie" } });
		fireEvent.change(genreInput, { target: { value: "Action" } });
		fireEvent.keyDown(genreInput, { key: "Enter" });
		fireEvent.change(releaseDateInput, { target: { value: "2025-03-30" } });
		fireEvent.change(ratingInput, { target: { value: "8" } });
		fireEvent.click(addButton);

		// Assert that the new movie is added to the list
		expect(screen.getByText("New Movie")).toBeInTheDocument();
		expect(screen.getByText("Action")).toBeInTheDocument();
		expect(screen.getByText("2025-03-30")).toBeInTheDocument();
		expect(screen.getByText("8")).toBeInTheDocument();
	});

	// Test for Read operation
	test("displays all movies in the list", () => {
		render(<MoviesPage />);

		// Assert that mock movies are displayed
		const mockMovies = screen.getAllByRole("row");
		expect(mockMovies.length).toBeGreaterThan(1); // Includes header row
	});

	// Test for Update operation
	test("updates an existing movie", () => {
		render(<MoviesPage />);

		// Simulate clicking the Edit button for the first movie
		const editButton = screen.getAllByText("Edit")[0];
		fireEvent.click(editButton);

		// Update the movie details
		const nameInput = screen.getByPlaceholderText("Name");
		fireEvent.change(nameInput, { target: { value: "Updated Movie" } });

		const saveButton = screen.getByText("Save Changes");
		fireEvent.click(saveButton);

		// Assert that the movie is updated in the list
		expect(screen.getByText("Updated Movie")).toBeInTheDocument();
	});

	// Test for Delete operation
	test("deletes a movie from the list", () => {
		render(<MoviesPage />);

		// Simulate clicking the Delete button for the first movie
		const deleteButton = screen.getAllByText("Delete")[0];
		fireEvent.click(deleteButton);

		// Assert that the movie is removed from the list
		expect(deleteButton).not.toBeInTheDocument();
	});
});
