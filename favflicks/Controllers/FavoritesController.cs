using favflicks.data;
using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace favflicks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController(IFavoriteService favoriteService) : ControllerBase
    {
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Favorite>>> GetFavoritesByUser(string userId)
        {
            var favorites = await favoriteService.GetFavoritesByUserIdAsync(userId);
            return Ok(favorites);
        }


        [HttpPost]
        public async Task<ActionResult> AddFavorite([FromBody] Favorite favorite)
        {
            await favoriteService.AddAsync(favorite);
            return CreatedAtAction(nameof(GetFavorite), new { id = favorite.Id }, favorite);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFavorite(int id)
        {
            var favorite = await favoriteService.GetByIdAsync(id);
            if (favorite == null)
                return NotFound();

            await favoriteService.DeleteAsync(favorite);
            return NoContent();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Favorite>> GetFavorite(int id)
        {
            var favorite = await favoriteService.GetByIdAsync(id);

            if (favorite == null)
                return NotFound();

            return Ok(favorite);
        }
    }
}
