using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace favflicks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WatchLaterController(IWatchLaterService watchLaterService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetWatchList()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var watchlist = await watchLaterService.GetWatchListByUserIdAsync(userId);
            var result = watchlist.Select(w => new
            {
                w.Id,
                w.MovieId,
                w.AddedDate,
                Movie = w.Movie == null ? null : new
                {
                    w.Movie.Id,
                    w.Movie.Name,
                    w.Movie.Description,
                    w.Movie.ImagePath,
                    w.Movie.BackdropPath,
                    w.Movie.ReleaseDate,
                    w.Movie.Genre,
                    w.Movie.Source,
                    w.Movie.ExternalId
                }
            });

            return Ok(result);
        }

        [HttpGet("check/{movieId}")]
        public async Task<ActionResult> CheckWatchlist(int movieId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var item = await watchLaterService.GetByMovieAndUserAsync(movieId, userId);
            return Ok(new { inWatchlist = item != null, watchlistId = item?.Id });
        }

        [HttpPost("{movieId}")]
        public async Task<ActionResult> AddToWatchList(int movieId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var watchList = new WatchList
            {
                UserId = userId,
                MovieId = movieId,
                AddedDate = DateTime.UtcNow
            };

            await watchLaterService.AddAsync(watchList);
            return Ok(new { message = "Added to watch later" });
        }

        [HttpDelete("{movieId}")]
        public async Task<ActionResult> RemoveFromWatchList(int movieId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await watchLaterService.DeleteByMovieAndUserAsync(movieId, userId);
            return NoContent();
        }
    }
}
