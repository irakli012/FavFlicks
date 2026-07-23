using favflicks.data;
using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace favflicks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoritesController(IFavoriteService favoriteService) : ControllerBase
    {
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<object>>> GetFavoritesByLoggedInUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var favorites = await favoriteService.GetFavoritesByUserIdAsync(userId);
            var result = favorites.Select(f => new
            {
                f.Id,
                f.MovieId,
                Movie = f.Movie == null ? null : new
                {
                    f.Movie.Id,
                    f.Movie.Name,
                    f.Movie.Description,
                    f.Movie.ImagePath,
                    f.Movie.BackdropPath,
                    f.Movie.ReleaseDate,
                    f.Movie.Genre,
                    f.Movie.Source,
                    f.Movie.ExternalId
                }
            });

            return Ok(result);
        }

        [HttpGet("check/{movieId}")]
        public async Task<ActionResult> CheckFavorite(int movieId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var item = await favoriteService.GetByMovieAndUserAsync(movieId, userId);
            return Ok(new { isFavorite = item != null, favoriteId = item?.Id });
        }

        [HttpPost("{movieId}")]
        public async Task<ActionResult> AddFavoriteByMovieId(int movieId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var favorite = new Favorite
            {
                UserId = userId,
                MovieId = movieId
            };

            await favoriteService.AddAsync(favorite);
            return Ok(new { message = "Added to favorites" });
        }

        [HttpPost]
        public async Task<ActionResult> AddFavorite([FromBody] Favorite favorite)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            favorite.UserId = userId;
            await favoriteService.AddAsync(favorite);
            return CreatedAtAction(nameof(GetFavorite), new { id = favorite.Id }, favorite);
        }

        [HttpDelete("{movieId}")]
        public async Task<IActionResult> DeleteFavoriteByMovieId(int movieId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await favoriteService.DeleteByMovieAndUserAsync(movieId, userId);
            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Favorite>> GetFavorite(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var favorite = await favoriteService.GetByIdAsync(id);
            if (favorite == null || favorite.UserId != userId)
                return NotFound();

            return Ok(favorite);
        }
    }
}
