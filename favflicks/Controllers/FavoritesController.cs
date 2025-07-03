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
        public async Task<ActionResult<IEnumerable<Favorite>>> GetFavoritesByLoggedInUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var favorites = await favoriteService.GetFavoritesByUserIdAsync(userId);
            return Ok(favorites);
        }


        [HttpPost]
        public async Task<ActionResult> AddFavorite([FromBody] Favorite favorite)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await favoriteService.AddAsync(favorite);
            return CreatedAtAction(nameof(GetFavorite), new { id = favorite.Id }, favorite);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFavorite(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var favorite = await favoriteService.GetByIdAsync(id);
            if (favorite == null || favorite.UserId != userId)
                return NotFound();

            await favoriteService.DeleteAsync(favorite);
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
