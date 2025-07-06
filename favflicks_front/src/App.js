import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails"; // ✅ Make sure this file exists

function HomePage() {
  return (
    <div>
      <h1 className="mb-4">🎬 FavFlicks</h1>
      <MovieList />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <nav>
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/movies/1">
                Sample Movie
              </NavLink>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
