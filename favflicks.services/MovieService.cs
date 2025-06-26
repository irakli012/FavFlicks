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

        public async Task<IEnumerable<Movie>> GetMovieListAsync()
        {
            return await context.Movies
                .Include(m => m.Tags)
                .ToListAsync();
        }

        async Task<Movie?> IMovieService.GetMovieByIdAsync(int id)
        {
            return await context.Movies
                .Include(m => m.Tags)
                .FirstOrDefaultAsync(m => m.Id == id);
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