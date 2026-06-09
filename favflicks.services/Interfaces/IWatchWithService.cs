using favflicks.data.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace favflicks.services.Interfaces
{
    public interface IWatchWithService
    {
        Task<WatchWithDto> AddWatchWithAsync(string initiatorId, string targetId, int movieId);
        Task<IEnumerable<WatchWithDto>> GetUserWatchWithsAsync(string userId);
        Task<bool> RemoveWatchWithAsync(int id, string requestingUserId);
        Task<bool> UpdateWatchWithStatusAsync(int id, string targetUserId, int newStatus);
    }
}
