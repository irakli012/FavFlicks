using favflicks.data;
using favflicks.data.Enums;
using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.services
{
    public class RatingService(AppDbContext context) : IRatingService
    {
        public async Task<IEnumerable<MovieRating>> GetRatingsByMovieIdAsync(int movieId)
        {
            return await context.MovieRatings
                .Where(r => r.MovieId == movieId)
                //.Include(r => r.Movie) disable for now to avoid circular reference
                .ToListAsync();
        }

        public async Task<IEnumerable<MovieRating>> GetRatingsByUserIdAsync(String userId)
        {
            return await context.MovieRatings
                .Where(r => r.UserId == userId)
                //.Include(r => r.Movie)
                .ToListAsync();
        }

        public async Task<MovieRating?> GetByIdAsync(int id)
        {
            return await context.MovieRatings
                //.Include(r => r.Movie)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task AddOrUpdateAsync(MovieRating rating)
        {
            var existing = await context.MovieRatings
                .FirstOrDefaultAsync(r => r.MovieId == rating.MovieId && r.UserId == rating.UserId);

            if (existing != null)
            {
                existing.Value = rating.Value;
            }
            else
            {
                context.MovieRatings.Add(rating);
            }

            await context.SaveChangesAsync();
        }
    }
}
