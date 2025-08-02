using favflicks.data.Enums;
using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace favflicks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController(IMovieService movieService, ILogger<MoviesController> logger) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> GetAllMovies()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
                var movies = await movieService.GetMovieListAsync(userId);
                return Ok(movies);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting all movies");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Movie>>> SearchMovies([FromQuery] string query)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
                var movies = await movieService.SearchAllSourcesAsync(query);
                return Ok(movies);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error searching movies");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovieById(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
                var movie = await movieService.GetMovieByIdAsync(id, userId);

                if (movie == null)
                    return NotFound();

                return Ok(movie);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting movie by ID");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("tmdb/{tmdbId}")]
        public async Task<ActionResult<Movie>> ImportFromTmdb(int tmdbId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var movie = await movieService.ImportFromTmdbAsync(tmdbId, userId);
                return CreatedAtAction(nameof(GetMovieById), new { id = movie.Id }, movie);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error importing from TMDB");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Movie>> CreateMovie([FromBody] Movie movie)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                // Ensure user can only create UserImport movies
                movie.Source = MovieSource.UserImport;
                movie.AddedByUserId = userId;
                movie.DateAdded = DateTime.UtcNow;

                var createdMovie = await movieService.AddManualMovieAsync(movie, userId);
                return CreatedAtAction(nameof(GetMovieById), new { id = createdMovie.Id }, createdMovie);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error creating movie");
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateMovie(int id, [FromBody] Movie movie)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var isAdmin = User.IsInRole("Admin");

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var existingMovie = await movieService.GetMovieByIdAsync(id, userId);
                if (existingMovie == null)
                    return NotFound();

                // Only allow updates to UserImport movies or by admin
                if (!isAdmin && existingMovie.Source != MovieSource.UserImport)
                    return Forbid();

                if (!isAdmin && existingMovie.AddedByUserId != userId)
                    return Forbid();

                if (id != movie.Id)
                    return BadRequest("ID mismatch");

                await movieService.UpdateAsync(movie);
                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating movie");
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var isAdmin = User.IsInRole("Admin");

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var movie = await movieService.GetMovieByIdAsync(id, userId);
                if (movie == null)
                    return NotFound();

                // Only allow deletion of UserImport movies or by admin
                if (!isAdmin && movie.Source != MovieSource.UserImport)
                    return Forbid();

                if (!isAdmin && movie.AddedByUserId != userId)
                    return Forbid();

                await movieService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting movie");
                return BadRequest(ex.Message);
            }
        }
    }
}