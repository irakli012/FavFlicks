using favflicks.data;
using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace favflicks.services
{
    public class WatchLaterService(AppDbContext context) : IWatchLaterService
    {
        public async Task<IEnumerable<WatchList>> GetWatchListByUserIdAsync(string userId)
        {
            return await context.WatchList
                .Include(w => w.Movie)
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.AddedDate)
                .ToListAsync();
        }

        public async Task<WatchList?> GetByIdAsync(int id)
        {
            return await context.WatchList
                .Include(w => w.Movie)
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        public async Task<WatchList?> GetByMovieAndUserAsync(int movieId, string userId)
        {
            return await context.WatchList
                .FirstOrDefaultAsync(w => w.MovieId == movieId && w.UserId == userId);
        }

        public async Task AddAsync(WatchList watchList)
        {
            var exists = await context.WatchList.AnyAsync(w =>
                w.MovieId == watchList.MovieId && w.UserId == watchList.UserId);

            if (!exists)
            {
                context.WatchList.Add(watchList);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(WatchList watchList)
        {
            context.WatchList.Remove(watchList);
            await context.SaveChangesAsync();
        }

        public async Task DeleteByMovieAndUserAsync(int movieId, string userId)
        {
            var existing = await context.WatchList
                .FirstOrDefaultAsync(w => w.MovieId == movieId && w.UserId == userId);

            if (existing != null)
            {
                context.WatchList.Remove(existing);
                await context.SaveChangesAsync();
            }
        }
    }
}
