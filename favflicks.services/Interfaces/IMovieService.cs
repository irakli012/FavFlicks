using favflicks.data.Enums;
using favflicks.data.Models;

namespace favflicks.services.Interfaces
{
    public interface IMovieService
    {
        // Local database operations
        Task<IEnumerable<Movie>> GetMovieListAsync(string userId);
        Task<Movie?> GetMovieByIdAsync(int id, string userId);
        Task<Movie> AddManualMovieAsync(Movie movie, string userId);
        Task UpdateAsync(Movie movie);
        Task DeleteAsync(int id);

        // TMDB API operations
        Task<Movie> ImportFromTmdbAsync(int tmdbId, string userId);
        Task<IEnumerable<Movie>> SearchTmdbMoviesAsync(string query);

        // Fetch API operations
        Task<IEnumerable<Movie>> SearchAllSourcesAsync(string query);
        Task<Movie?> GetMovieFromAllSourcesAsync(int id, string source, string userId);
    }
}