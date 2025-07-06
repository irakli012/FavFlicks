import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MovieList from "./components/MovieList";

function HomePage() {
  return (
    <div>
      <h1>FavFlicks</h1>
      <MovieList />
    </div>
  );
}

function MovieDetailsPage() {
  return <h2>Movie Details Page (Coming Soon)</h2>;
}

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <nav>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/movies/1">Sample Movie</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
