import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h2>Home Page</h2>;
}

function Movies() {
  return <h2>Movies List Page</h2>;
}

function App() {
  return (
    <div className="container">
      <nav className="my-3">
        <Link to="/" className="me-3">Home</Link>
        <Link to="/movies">Movies</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </div>
  );
}

export default App;
