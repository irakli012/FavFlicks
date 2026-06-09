using favflicks.data.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace favflicks.services.Interfaces
{
    public interface IFriendshipService
    {
        Task<FriendshipDto> SendRequestAsync(string requesterId, string addresseeId);
        Task<FriendshipDto> AcceptRequestAsync(string userId, string requesterId);
        Task<bool> RemoveFriendAsync(string userId, string otherUserId);
        Task<IEnumerable<FriendshipDto>> GetFriendsAsync(string userId);
        Task<IEnumerable<FriendshipDto>> GetPendingRequestsAsync(string userId);
    }
}
