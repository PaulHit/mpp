-- Create a function to get movie statistics
CREATE OR REPLACE FUNCTION get_movie_statistics()
RETURNS TABLE (
    total_movies bigint,
    avg_rating numeric,
    highest_rated_movie text,
    lowest_rated_movie text,
    most_common_genre text,
    genre_count bigint,
    movies_per_year jsonb
) AS $$
BEGIN
    RETURN QUERY
    WITH movie_stats AS (
        SELECT 
            COUNT(*) as total_movies,
            AVG(rating) as avg_rating,
            (SELECT name FROM movies WHERE rating = (SELECT MAX(rating) FROM movies) LIMIT 1) as highest_rated_movie,
            (SELECT name FROM movies WHERE rating = (SELECT MIN(rating) FROM movies) LIMIT 1) as lowest_rated_movie
        FROM movies
    ),
    genre_stats AS (
        SELECT 
            g.name as genre_name,
            COUNT(*) as genre_count
        FROM genres g
        JOIN movie_genres mg ON g.id = mg.genre_id
        GROUP BY g.name
        ORDER BY genre_count DESC
        LIMIT 1
    ),
    yearly_stats AS (
        SELECT 
            EXTRACT(YEAR FROM release_date) as year,
            COUNT(*) as movie_count
        FROM movies
        GROUP BY year
        ORDER BY year
    )
    SELECT 
        ms.total_movies,
        ms.avg_rating,
        ms.highest_rated_movie,
        ms.lowest_rated_movie,
        gs.genre_name,
        gs.genre_count,
        jsonb_object_agg(ys.year, ys.movie_count) as movies_per_year
    FROM movie_stats ms
    CROSS JOIN genre_stats gs
    CROSS JOIN yearly_stats ys
    GROUP BY 
        ms.total_movies,
        ms.avg_rating,
        ms.highest_rated_movie,
        ms.lowest_rated_movie,
        gs.genre_name,
        gs.genre_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to execute arbitrary SQL (needed for index creation)
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void AS $$
BEGIN
    EXECUTE sql;
END;
$$ LANGUAGE plpgsql; 