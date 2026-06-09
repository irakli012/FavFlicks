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
    public class FriendsController(IFriendshipService friendshipService, ILogger<FriendsController> logger) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetFriends()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var list = await friendshipService.GetFriendsAsync(userId);
                return Ok(list);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting friends list");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingRequests()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var list = await friendshipService.GetPendingRequestsAsync(userId);
                return Ok(list);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting pending requests");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("request/{targetUserId}")]
        public async Task<IActionResult> SendFriendRequest(string targetUserId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var friendship = await friendshipService.SendRequestAsync(userId, targetUserId);
                return Ok(friendship);
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
                logger.LogError(ex, "Error sending friend request");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("accept/{requesterId}")]
        public async Task<IActionResult> AcceptFriendRequest(string requesterId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var friendship = await friendshipService.AcceptRequestAsync(userId, requesterId);
                return Ok(friendship);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error accepting friend request");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{otherUserId}")]
        public async Task<IActionResult> RemoveFriendOrRequest(string otherUserId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId)) return Unauthorized();

                var success = await friendshipService.RemoveFriendAsync(userId, otherUserId);
                if (!success) return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error removing friend or request");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
