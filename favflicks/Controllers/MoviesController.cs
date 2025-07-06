using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace favflicks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController(IMovieService movieService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> GetAll()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var movies = await movieService.GetMovieListAsync(userId);
            return Ok(movies);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovie(int id)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var movie = await movieService.GetMovieByIdAsync(id, userId);
            return Ok(movie);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create([FromBody] Movie movie)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            //force the userid to be currect user
            movie.UserId = userId;

            await movieService.AddAsync(movie);
            return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, movie);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> Update(int id, Movie movie)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && movie.UserId != userId)
                return Forbid();

            if (id != movie.Id) return BadRequest();

            await movieService.UpdateAsync(movie);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> Delete(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            var movie = await movieService.GetMovieByIdAsync(id, userId);
            if (movie == null) return NotFound();

            if (!isAdmin && movie.UserId != userId)
                return Forbid();

            await movieService.DeleteAsync(id);
            return NoContent();
        }
    }
}