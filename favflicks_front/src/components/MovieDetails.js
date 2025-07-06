import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetails.css';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`https://localhost:7245/api/movies/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(console.error);
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-details">
      <img src={`https://localhost:7245${movie.imagePath}`} alt={movie.name} />
      <h1>{movie.name}</h1>
      <p>{movie.description}</p>

      <h3>Tags</h3>
      <ul>
        {movie.tags.map(tag => <li key={tag.id}>{tag.name}</li>)}
      </ul>

      <h3>Ratings</h3>
      <ul>
        {movie.ratings.map(r => (
          <li key={r.id}>
            ⭐ {r.value} - by {r.userName ?? "Anonymous"}
          </li>
        ))}
      </ul>

      <h3>Comments</h3>
      <ul>
        {movie.comments.map(c => (
          <li key={c.id}>
            <strong>{c.userName ?? "Anonymous"}:</strong> {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
