using favflicks.data.Dtos;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace favflicks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WatchWithController(IWatchWithService watchWithService, ILogger<WatchWithController> logger) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetWatchWiths()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var list = await watchWithService.GetUserWatchWithsAsync(userId);
                return Ok(list);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting watch with list");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddWatchWith([FromBody] CreateWatchWithDto dto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var watchWith = await watchWithService.AddWatchWithAsync(userId, dto.TargetUserId, dto.MovieId);
                return Ok(watchWith);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error adding watch with");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveWatchWith(int id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var success = await watchWithService.RemoveWatchWithAsync(id, userId);
                if (!success) return NotFound();

                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error removing watch with");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateWatchWithStatus(int id, [FromBody] UpdateWatchWithStatusDto dto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var success = await watchWithService.UpdateWatchWithStatusAsync(id, userId, dto.Status);
                if (!success) return NotFound();

                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating watch with status");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
