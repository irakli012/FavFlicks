using favflicks.data;
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
    public class FavoriteService(AppDbContext context) : IFavoriteService
    {
        public async Task<IEnumerable<Favorite>> GetFavoritesByUserIdAsync(string userId)
        {
            return await context.Favorites
                .Include(f => f.Movie)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        public async Task AddAsync(Favorite favorite)
        {
            //check if favorite already exists for that user
            var exists = await context.Favorites.AnyAsync(f =>
                f.MovieId == favorite.MovieId && f.UserId == favorite.UserId);

            if (!exists)
            {
                context.Favorites.Add(favorite);
                await context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(Favorite favorite)
        {
            context.Favorites.Remove(favorite);
            await context.SaveChangesAsync();
        }

        public async Task<Favorite?> GetByIdAsync(int id)
        {
            return await context.Favorites
                .Include (f => f.Movie)
                .FirstOrDefaultAsync(f => f.Id == id);
        }
    }
}
