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
        [Authorize]
        public async Task<ActionResult> AddComment([FromBody] Comment comment)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            comment.UserId = userId;
            await commentService.AddAsync(comment);

            return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateComment(int id, [FromBody] Comment comment)
        {
            if (id != comment.Id) return BadRequest();

            var existing = await commentService.GetCommentsByIdAsync(id);
            if (existing == null) return NotFound();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && existing.UserId != userId)
                return Forbid();

            await commentService.UpdateAsync(comment);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteComment(int id)
        {
            var comment = await commentService.GetCommentsByIdAsync(id);
            if (comment == null) return NotFound();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && comment.UserId != userId)
                return Forbid();

            await commentService.DeleteAsync(id);
            return NoContent();
        }
    }
}