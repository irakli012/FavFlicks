using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace favflicks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController(ICommentService commentService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByMovieId(int movie)
        {
            var comments = await commentService.GetCommentsByMovieIdAsync(movie);
            return Ok(comments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
            var comments = await commentService.GetCommentsByIdAsync(id);

            if (comments == null)
                return NotFound();

            return Ok(comments);
        }

        [HttpPost]
        public async Task<ActionResult> AddComment([FromBody] Comment comment)
        {
            await commentService.AddAsync(comment);
            return CreatedAtAction(nameof(GetComment), new {id = comment.Id}, comment);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateComment(int id, [FromBody] Comment comment)
        {
            if (id != comment.Id)
                return BadRequest();

            await commentService.UpdateAsync(comment);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteComment(int id)
        {
            await commentService.DeleteAsync(id);
            return NoContent();
        }
    }
}
    