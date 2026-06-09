using favflicks.data;
using favflicks.data.Dtos;
using favflicks.data.Enums;
using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace favflicks.services
{
    public class FriendshipService(AppDbContext context) : IFriendshipService
    {
        public async Task<FriendshipDto> SendRequestAsync(string requesterId, string addresseeId)
        {
            if (requesterId == addresseeId) throw new ArgumentException("Cannot send request to yourself");

            var addressee = await context.Users.FindAsync(addresseeId);
            if (addressee == null) throw new ArgumentException("User not found");

            var existing = await context.Friendships.FirstOrDefaultAsync(f => 
                (f.RequesterId == requesterId && f.AddresseeId == addresseeId) ||
                (f.RequesterId == addresseeId && f.AddresseeId == requesterId));

            if (existing != null) throw new InvalidOperationException("Friendship already exists or is pending");

            var friendship = new Friendship
            {
                RequesterId = requesterId,
                AddresseeId = addresseeId,
                Status = FriendshipStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            context.Friendships.Add(friendship);
            await context.SaveChangesAsync();

            return await GetFriendshipDtoAsync(friendship.Id);
        }

        public async Task<FriendshipDto> AcceptRequestAsync(string userId, string requesterId)
        {
            var request = await context.Friendships.FirstOrDefaultAsync(f => 
                f.RequesterId == requesterId && 
                f.AddresseeId == userId && 
                f.Status == FriendshipStatus.Pending);

            if (request == null) throw new InvalidOperationException("Pending request not found");

            request.Status = FriendshipStatus.Accepted;
            await context.SaveChangesAsync();

            return await GetFriendshipDtoAsync(request.Id);
        }

        public async Task<bool> RemoveFriendAsync(string userId, string otherUserId)
        {
            var friendship = await context.Friendships.FirstOrDefaultAsync(f => 
                (f.RequesterId == userId && f.AddresseeId == otherUserId) ||
                (f.RequesterId == otherUserId && f.AddresseeId == userId));

            if (friendship == null) return false;

            context.Friendships.Remove(friendship);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<FriendshipDto>> GetFriendsAsync(string userId)
        {
            var friendships = await context.Friendships
                .Include(f => f.Requester)
                .Include(f => f.Addressee)
                .Where(f => (f.RequesterId == userId || f.AddresseeId == userId) && f.Status == FriendshipStatus.Accepted)
                .ToListAsync();

            return friendships.Select(f => MapToDto(f));
        }

        public async Task<IEnumerable<FriendshipDto>> GetPendingRequestsAsync(string userId)
        {
            var requests = await context.Friendships
                .Include(f => f.Requester)
                .Include(f => f.Addressee)
                .Where(f => f.AddresseeId == userId && f.Status == FriendshipStatus.Pending)
                .ToListAsync();

            return requests.Select(f => MapToDto(f));
        }

        private async Task<FriendshipDto> GetFriendshipDtoAsync(int id)
        {
            var f = await context.Friendships
                .Include(x => x.Requester)
                .Include(x => x.Addressee)
                .FirstOrDefaultAsync(x => x.Id == id);
            
            return MapToDto(f);
        }

        private FriendshipDto MapToDto(Friendship f)
        {
            return new FriendshipDto
            {
                Id = f.Id,
                RequesterId = f.RequesterId,
                RequesterUsername = f.Requester.UserName,
                AddresseeId = f.AddresseeId,
                AddresseeUsername = f.Addressee.UserName,
                Status = f.Status,
                CreatedAt = f.CreatedAt
            };
        }
    }
}
