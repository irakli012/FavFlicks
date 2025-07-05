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
    public class RatingsController(IRatingService ratingService) : ControllerBase
    {
        [HttpGet("movie/{movieId}")]
        public async Task<ActionResult<IEnumerable<MovieRating>>> GetRatingsForMovie(int movieId)
        {
            var ratings = await ratingService.GetRatingsByMovieIdAsync(movieId);
            return Ok(ratings);
        }

        [HttpGet("movie/{movieId}/user")]
        [Authorize]
        public async Task<ActionResult<MovieRating?>> GetCurrentUserRatingForMovie(int movieId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var ratings = await ratingService.GetRatingsByUserIdAsync(userId);
            var rating = ratings.FirstOrDefault(r => r.MovieId == movieId);

            return rating == null ? NotFound() : Ok(rating);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")] // for now
        public async Task<ActionResult<MovieRating?>> GetRating(int id)
        {
            var rating = await ratingService.GetByIdAsync(id);

            if (rating == null)
                return NotFound();

            return Ok(rating);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> AddOrUpdateRating([FromBody] MovieRating rating)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            rating.UserId = userId;

            await ratingService.AddOrUpdateAsync(rating);
            return Ok();
        }
    }
}
