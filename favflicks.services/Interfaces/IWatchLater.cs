using favflicks.data.Models;

namespace favflicks.services.Interfaces
{
    public interface IWatchLaterService
    {
        Task<IEnumerable<WatchList>> GetWatchListByUserIdAsync(string userId);
        Task<WatchList?> GetByIdAsync(int id);
        Task<WatchList?> GetByMovieAndUserAsync(int movieId, string userId);
        Task AddAsync(WatchList watchList);
        Task DeleteAsync(WatchList watchList);
        Task DeleteByMovieAndUserAsync(int movieId, string userId);
    }
}
