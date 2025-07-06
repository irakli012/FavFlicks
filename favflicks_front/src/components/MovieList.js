import React, { useEffect, useState } from "react";
import axios from "axios";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://localhost:7245/api/Movies";

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching movies:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading movies...</p>;
  if (movies.length === 0) return <p>No movies found.</p>;

  return (
    <div className="row">
      {movies.map(movie => (
        <div key={movie.id} className="col-md-4 mb-4">
          <div className="card h-100">
            <img 
              src={movie.imagePath || "https://via.placeholder.com/300x450?text=No+Image"} 
              className="card-img-top" 
              alt={movie.name} 
              style={{height: "450px", objectFit: "cover"}}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{movie.name}</h5>
              <p className="card-text flex-grow-1">{movie.description?.substring(0, 100)}...</p>
              <div>
                <strong>Rating: </strong> {movie.averageRating?.toFixed(1) || "N/A"} / 5
              </div>
              {/* Placeholder Favorite Button */}
              <button className="btn btn-outline-primary mt-2">♡ Favorite</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieList;
