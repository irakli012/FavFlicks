using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace favflicks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController(IMovieService movieService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> GetAll([FromQuery] string userId)
        {
            var movies = await movieService.GetMovieListAsync(userId);
            return Ok(movies);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovie(int id, [FromQuery] string userId)
        {
            var movie = await movieService.GetMovieByIdAsync(id, userId);
            return Ok(movie);
        }

        [HttpPost]
        public async Task<ActionResult> Create(Movie movie)
        {
            await movieService.AddAsync(movie);
            return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, movie);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Movie>> Update(int id, Movie movie)
        {
            if (id != movie.Id)
                return BadRequest();

            await movieService.UpdateAsync(movie);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await movieService.DeleteAsync(id);
            return NoContent();
        }
    }
}