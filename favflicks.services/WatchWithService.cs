using favflicks.data;
using favflicks.data.Dtos;
using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace favflicks.services
{
    public class WatchWithService(AppDbContext context) : IWatchWithService
    {
        public async Task<WatchWithDto> AddWatchWithAsync(string initiatorId, string targetId, int movieId)
        {
            // Check if movie exists
            var movie = await context.Movies.FindAsync(movieId);
            if (movie == null) throw new ArgumentException("Movie not found");

            // Check if users exist
            var initiator = await context.Users.FindAsync(initiatorId);
            var target = await context.Users.FindAsync(targetId);
            if (initiator == null || target == null) throw new ArgumentException("User not found");

            // Check if already exists
            var existing = await context.WatchWiths
                .FirstOrDefaultAsync(w => 
                    ((w.InitiatorUserId == initiatorId && w.TargetUserId == targetId) || 
                     (w.InitiatorUserId == targetId && w.TargetUserId == initiatorId)) && 
                    w.MovieId == movieId);
                    
            if (existing != null) throw new InvalidOperationException("Already in watch with list");

            var watchWith = new WatchWith
            {
                InitiatorUserId = initiatorId,
                TargetUserId = targetId,
                MovieId = movieId,
                AddedDate = DateTime.UtcNow
            };

            context.WatchWiths.Add(watchWith);
            await context.SaveChangesAsync();

            return await GetWatchWithDtoAsync(watchWith.Id);
        }

        public async Task<IEnumerable<WatchWithDto>> GetUserWatchWithsAsync(string userId)
        {
            var watchWiths = await context.WatchWiths
                .Include(w => w.InitiatorUser)
                .Include(w => w.TargetUser)
                .Include(w => w.Movie)
                .Where(w => w.InitiatorUserId == userId || w.TargetUserId == userId)
                .OrderByDescending(w => w.AddedDate)
                .ToListAsync();

            return watchWiths.Select(w => new WatchWithDto
            {
                Id = w.Id,
                InitiatorUserId = w.InitiatorUserId,
                InitiatorUsername = w.InitiatorUser.UserName,
                TargetUserId = w.TargetUserId,
                TargetUsername = w.TargetUser.UserName,
                MovieId = w.MovieId,
                MovieTitle = w.Movie.Name,
                MovieImagePath = w.Movie.ImagePath,
                MovieYear = w.Movie.ReleaseDate?.Year ?? 0,
                MovieGenre = w.Movie.Genre,
                AddedDate = w.AddedDate,
                Status = (int)w.Status
            });
        }

        public async Task<bool> RemoveWatchWithAsync(int id, string requestingUserId)
        {
            var watchWith = await context.WatchWiths.FindAsync(id);
            if (watchWith == null) return false;

            // Only initiator or target can remove
            if (watchWith.InitiatorUserId != requestingUserId && watchWith.TargetUserId != requestingUserId)
            {
                throw new UnauthorizedAccessException("Not authorized to remove this item");
            }

            context.WatchWiths.Remove(watchWith);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateWatchWithStatusAsync(int id, string targetUserId, int newStatus)
        {
            var watchWith = await context.WatchWiths.FindAsync(id);
            if (watchWith == null) return false;

            if (watchWith.TargetUserId != targetUserId)
            {
                throw new UnauthorizedAccessException("Only the target user can accept or decline this request");
            }

            if (!Enum.IsDefined(typeof(favflicks.data.Enums.WatchWithStatus), newStatus))
            {
                throw new ArgumentException("Invalid status");
            }

            watchWith.Status = (favflicks.data.Enums.WatchWithStatus)newStatus;
            await context.SaveChangesAsync();
            return true;
        }

        private async Task<WatchWithDto> GetWatchWithDtoAsync(int id)
        {
            var w = await context.WatchWiths
                .Include(x => x.InitiatorUser)
                .Include(x => x.TargetUser)
                .Include(x => x.Movie)
                .FirstOrDefaultAsync(x => x.Id == id);

            return new WatchWithDto
            {
                Id = w.Id,
                InitiatorUserId = w.InitiatorUserId,
                InitiatorUsername = w.InitiatorUser.UserName,
                TargetUserId = w.TargetUserId,
                TargetUsername = w.TargetUser.UserName,
                MovieId = w.MovieId,
                MovieTitle = w.Movie.Name,
                MovieImagePath = w.Movie.ImagePath,
                MovieYear = w.Movie.ReleaseDate?.Year ?? 0,
                MovieGenre = w.Movie.Genre,
                AddedDate = w.AddedDate,
                Status = (int)w.Status
            };
        }
    }
}
