using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("movie/{movieId}/user/{userid}")]
        public async Task<ActionResult<IEnumerable<MovieRating>>> GetUserRatingForMovie(string userid)
        {
            var rating = await ratingService.GetRatingsByUserIdAsync(userid);

            if (rating == null)
                return NotFound();

            return Ok(rating);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovieRating?>> GetRating(int id)
        {
            var rating = await ratingService.GetByIdAsync(id);

            if (rating == null)
                return NotFound();

            return Ok(rating);
        }

        [HttpPost]
        public async Task<ActionResult> AddOrUpdateRating([FromBody] MovieRating rating)
        {
            await ratingService.AddOrUpdateAsync(rating);
            return Ok();
        }
    }
}
