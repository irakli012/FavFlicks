import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MovieList.css"; // make sure this includes the hover styles

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = "https://localhost:7245/api/Movies";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading movies...</p>;
  if (movies.length === 0) return <p>No movies found.</p>;

  return (
    <div className="container">
      <div className="row">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="col-lg-4 col-md-6 mb-4"
            onClick={() => navigate(`/movies/${movie.id}`)}
          >
            <div className="card h-100 shadow-sm movie-card">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "62.5%",
                  overflow: "hidden",
                  borderTopLeftRadius: "0.25rem",
                  borderTopRightRadius: "0.25rem",
                }}
              >
                <img
                  src={`https://localhost:7245${movie.imagePath}`}
                  alt={movie.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{movie.name}</h5>
                <p className="card-text flex-grow-1">
                  {movie.description?.substring(0, 100)}...
                </p>
                <div>
                  <strong>Rating:</strong>{" "}
                  {movie.averageRating?.toFixed(1) || "N/A"} / 10
                </div>
                <button className="btn btn-outline-primary mt-2">
                  ♡ Favorite
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
