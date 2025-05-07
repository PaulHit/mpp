const request = require("supertest");
const { GET, POST, PATCH, DELETE } = require("@/app/api/movies/route");
const { mockMovies } = require("@/data/mockMovies");

describe("Movies API", () => {
	let movies = [...mockMovies];

	beforeEach(() => {
		movies = [...mockMovies]; // Reset the in-memory database before each test
	});

	it("should fetch all movies", async () => {
		const response = await GET(new Request("http://localhost/api/movies"));
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual(movies);
	});

	it("should add a new movie", async () => {
		const newMovie = {
			name: "New Movie",
			genres: ["Action"],
			releaseDate: "2025-05-07",
			rating: 8,
			description: "A new action movie",
		};

		const request = new Request("http://localhost/api/movies", {
			method: "POST",
			body: JSON.stringify(newMovie),
		});

		const response = await POST(request);
		const data = await response.json();

		expect(response.status).toBe(201);
		expect(data.name).toBe(newMovie.name);
		expect(data.id).toBeDefined();
	});

	it("should update an existing movie", async () => {
		const updatedMovie = {
			id: mockMovies[0].id,
			name: "Updated Movie",
		};

		const request = new Request("http://localhost/api/movies", {
			method: "PATCH",
			body: JSON.stringify(updatedMovie),
		});

		const response = await PATCH(request);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.name).toBe(updatedMovie.name);
	});

	it("should delete a movie", async () => {
		const movieId = mockMovies[0].id;

		const request = new Request(`http://localhost/api/movies?id=${movieId}`, {
			method: "DELETE",
		});

		const response = await DELETE(request);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.message).toBe("Movie deleted successfully");
	});

	it("should return 404 for updating a non-existent movie", async () => {
		const updatedMovie = {
			id: "non-existent-id",
			name: "Non-existent Movie",
		};

		const request = new Request("http://localhost/api/movies", {
			method: "PATCH",
			body: JSON.stringify(updatedMovie),
		});

		const response = await PATCH(request);
		const data = await response.json();

		expect(response.status).toBe(404);
		expect(data.error).toBe("Movie not found");
	});
});
