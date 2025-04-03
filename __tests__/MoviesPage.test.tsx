import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import MoviesPage from "@/app/page";

test("should add a movie to the list", () => {
	render(<MoviesPage />);

	fireEvent.change(screen.getByPlaceholderText("Name"), {
		target: { value: "Inception" },
	});

	const genreInput = screen.getByPlaceholderText(
		"Enter genres (press space or enter to add)"
	);
	fireEvent.change(genreInput, { target: { value: "Sci-Fi" } });
	fireEvent.keyDown(genreInput, { key: "Enter" });

	fireEvent.change(screen.getByPlaceholderText("Rating (1-10)"), {
		target: { value: "9" },
	});
	fireEvent.change(screen.getByPlaceholderText("Description (optional)"), {
		target: { value: "A mind-bending thriller." },
	});

	fireEvent.click(screen.getByText("Add Movie"));

	expect(screen.getByText("Inception")).toBeInTheDocument();
});

test("should desplay a movie in the list", () => {
	render(<MoviesPage />);

	expect(screen.getByText("Inception")).toBeInTheDocument();
});

test("should remove a movie from the list", () => {
	render(<MoviesPage />);

	const movieRow = screen.getByText("Inception").closest("tr");
	expect(movieRow).toBeInTheDocument();

	if (!movieRow) {
		throw new Error("Movie row not found");
	}
	const deleteButton = within(movieRow).getByText("Delete");
	fireEvent.click(deleteButton);

	expect(movieRow).not.toBeInTheDocument();
});

// test("should update a movie in the list", () => {
// 	render(<MoviesPage />);

// 	const movieRow = screen.getByText("Inception").closest("tr");
// 	expect(movieRow).toBeInTheDocument();

// 	if (!movieRow) {
// 		throw new Error("Movie row not found");
// 	}
// 	const editButton = within(movieRow).getByText("Edit");
// 	fireEvent.click(editButton);

// 	const nameInput = screen.getByPlaceholderText("Name");
// 	fireEvent.change(nameInput, { target: { value: "Oppenheimer" } });

// 	fireEvent.click(screen.getByText("Save"));

// 	const movieRowUpdated = screen.getByText("Oppenheimer").closest("tr");
// 	expect(movieRowUpdated).toBeInTheDocument();
// });
