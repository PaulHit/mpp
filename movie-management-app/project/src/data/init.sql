-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS movies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    release_date DATE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
    description TEXT
);

CREATE TABLE IF NOT EXISTS genres (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS movie_genres (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
    UNIQUE(movie_id, genre_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS movies_name_idx ON movies(name);
CREATE INDEX IF NOT EXISTS movies_rating_idx ON movies(rating);
CREATE INDEX IF NOT EXISTS movies_release_date_idx ON movies(release_date);
CREATE INDEX IF NOT EXISTS genres_name_idx ON genres(name);

-- Insert initial genres
INSERT INTO genres (name) VALUES
    ('Sci-Fi'),
    ('Thriller'),
    ('Action'),
    ('Crime'),
    ('Drama'),
    ('Adventure'),
    ('Fantasy'),
    ('Animation'),
    ('Romance')
ON CONFLICT (name) DO NOTHING;

-- Insert movies
WITH inserted_movies AS (
    INSERT INTO movies (name, release_date, rating, description) VALUES
        ('Inception', '2010-07-16', 8.8, 'A thief who steals corporate secrets through dream-sharing technology.'),
        ('The Dark Knight', '2008-07-18', 9.0, 'Batman faces the Joker in a battle for Gotham''s soul.'),
        ('Interstellar', '2014-11-07', 8.6, 'A team of explorers travel through a wormhole in space to save humanity.'),
        ('The Matrix', '1999-03-31', 8.7, 'A hacker discovers the truth about his reality and his role in the war against its controllers.'),
        ('The Godfather', '1972-03-24', 9.2, 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.'),
        ('Pulp Fiction', '1994-10-14', 8.9, 'The lives of two mob hitmen, a boxer, and others intertwine in a tale of violence and redemption.'),
        ('The Shawshank Redemption', '1994-09-22', 9.3, 'Two imprisoned men bond over a number of years, finding solace and redemption.'),
        ('Fight Club', '1999-10-15', 8.8, 'An insomniac office worker and a soap salesman form an underground fight club.'),
        ('Forrest Gump', '1994-07-06', 8.8, 'The life story of a slow-witted but kind-hearted man from Alabama.'),
        ('The Lord of the Rings: The Fellowship of the Ring', '2001-12-19', 8.8, 'A meek Hobbit and his companions set out to destroy a powerful ring.'),
        ('The Avengers', '2012-05-04', 8.0, 'Earth''s mightiest heroes must come together to stop an alien invasion.'),
        ('Gladiator', '2000-05-05', 8.5, 'A betrayed Roman general seeks revenge against the corrupt emperor.'),
        ('The Lion King', '1994-06-24', 8.5, 'A young lion prince flees his kingdom only to learn the true meaning of responsibility.'),
        ('Titanic', '1997-12-19', 7.9, 'A love story unfolds on the ill-fated RMS Titanic.'),
        ('Star Wars: Episode IV - A New Hope', '1977-05-25', 8.6, 'Luke Skywalker joins forces to save the galaxy from the Empire.')
    RETURNING id, name
)
-- Insert movie-genre relationships
INSERT INTO movie_genres (movie_id, genre_id)
SELECT 
    m.id,
    g.id
FROM inserted_movies m
CROSS JOIN LATERAL (
    SELECT id FROM genres WHERE name = ANY(
        CASE m.name
            WHEN 'Inception' THEN ARRAY['Sci-Fi', 'Thriller']
            WHEN 'The Dark Knight' THEN ARRAY['Action', 'Crime', 'Drama']
            WHEN 'Interstellar' THEN ARRAY['Sci-Fi', 'Adventure', 'Drama']
            WHEN 'The Matrix' THEN ARRAY['Sci-Fi', 'Action']
            WHEN 'The Godfather' THEN ARRAY['Crime', 'Drama']
            WHEN 'Pulp Fiction' THEN ARRAY['Crime', 'Drama']
            WHEN 'The Shawshank Redemption' THEN ARRAY['Drama']
            WHEN 'Fight Club' THEN ARRAY['Drama']
            WHEN 'Forrest Gump' THEN ARRAY['Drama', 'Romance']
            WHEN 'The Lord of the Rings: The Fellowship of the Ring' THEN ARRAY['Adventure', 'Drama', 'Fantasy']
            WHEN 'The Avengers' THEN ARRAY['Action', 'Adventure', 'Sci-Fi']
            WHEN 'Gladiator' THEN ARRAY['Action', 'Adventure', 'Drama']
            WHEN 'The Lion King' THEN ARRAY['Animation', 'Adventure', 'Drama']
            WHEN 'Titanic' THEN ARRAY['Drama', 'Romance']
            WHEN 'Star Wars: Episode IV - A New Hope' THEN ARRAY['Action', 'Adventure', 'Fantasy']
        END
    )
) g; 