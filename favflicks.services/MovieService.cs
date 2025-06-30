using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using favflicks.data;
using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace favflicks.services
{
    public class MovieService(AppDbContext context) : IMovieService
    {

        public async Task<IEnumerable<Movie>> GetMovieListAsync(string userId)
        {
            var movies = await context.Movies
                    .Include(m => m.Tags)
                    .Include(m => m.Comments)
                    .Include(m => m.Ratings)
                    .Include(m => m.Favorites)
                    .ToListAsync();

            foreach (var movie in movies)
            {
                movie.AverageRating = movie.Ratings.Any()
                    ? movie.Ratings.Average(r => (double)r.Value)
                    : 0;

                movie.IsFavorite = movie.Favorites.Any(f => f.UserId == userId);
            }

            return movies;
        }

        async Task<Movie?> IMovieService.GetMovieByIdAsync(int id, string userId)
        {
            var movie = await context.Movies
                .Include(m => m.Tags)
                .Include(m => m.Comments)
                .Include(m => m.Ratings)
                .Include(m => m.Favorites)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movie != null)
            {
                movie.AverageRating = movie.Ratings.Any()
                    ? movie.Ratings.Average(r => (double)r.Value)
                    : 0;

                movie.IsFavorite = movie.Favorites.Any(f => f.UserId == userId);
            }

            return movie;
        }

        async Task IMovieService.AddAsync(Movie movie)
        {
            var tagIds = movie.Tags.Select(t => t.Id).ToList();

            var existingTags = await context.Tags
                .Where(t => tagIds.Contains(t.Id))
                .ToListAsync();

            movie.Tags = existingTags;

            context.Movies.Add(movie);
            await context.SaveChangesAsync();
        }

        async Task IMovieService.UpdateAsync(Movie movie)
        {
            var existing = await context.Movies
                .Include(m => m.Tags)
                .FirstOrDefaultAsync(m => m.Id == movie.Id);

            if (existing == null) return;

            existing.Name = movie.Name;
            existing.Description = movie.Description;
            existing.ImagePath = movie.ImagePath;
            existing.UserId = movie.UserId;

            // avoid dublicate tags error
            existing.Tags.Clear();

            var tagIds = movie.Tags.Select(t => t.Id).ToList();
            var tags = await context.Tags.Where(t => tagIds.Contains(t.Id)).ToListAsync();

            foreach (var tag in tags)
                existing.Tags.Add(tag);

            await context.SaveChangesAsync();
        }


        async Task IMovieService.DeleteAsync(int id)
        {
            var movie = await context.Movies.FindAsync(id);
            if (movie != null)
            {
                context.Movies.Remove(movie);
                await context.SaveChangesAsync();
            }
        }

    }
}