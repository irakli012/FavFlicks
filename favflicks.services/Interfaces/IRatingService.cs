using favflicks.data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.services.Interfaces
{
    public interface IRatingService
    {
        Task<IEnumerable<MovieRating>> GetRatingsByMovieIdAsync(int movieId);
        Task<IEnumerable<MovieRating>> GetRatingsByUserIdAsync(string userId);
        Task<MovieRating?> GetByIdAsync(int id);
        Task AddOrUpdateAsync(MovieRating rating);
    }
}
