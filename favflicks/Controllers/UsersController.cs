using favflicks.data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace favflicks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(AppDbContext context) : ControllerBase
    {
        [HttpGet("search")]
        [Authorize]
        public async Task<IActionResult> SearchUsers([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(new List<object>());

            var users = await context.Users
                .Where(u => Microsoft.EntityFrameworkCore.EF.Functions.ILike(u.UserName, $"%{query}%") || Microsoft.EntityFrameworkCore.EF.Functions.ILike(u.Email, $"%{query}%"))
                .Take(10)
                .Select(u => new
                {
                    id = u.Id,
                    userName = u.UserName,
                    email = u.Email
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound();

            if (user.Profile == null)
            {
                user.Profile = new favflicks.data.Models.UserProfile
                {
                    UserId = userId,
                    Bio = "Binging the classics and hunting for the next indie gem. 🍿",
                    Location = "Tbilisi, Georgia",
                    JoinDate = DateTime.UtcNow
                };
                context.Set<favflicks.data.Models.UserProfile>().Add(user.Profile);
                await context.SaveChangesAsync();
            }

            return Ok(new
            {
                userId = user.Id,
                userName = user.UserName,
                email = user.Email,
                bio = user.Profile.Bio,
                location = user.Profile.Location,
                joinDate = user.Profile.JoinDate,
                profilePictureUrl = user.Profile.ProfilePictureUrl,
                coverImageUrl = user.Profile.CoverImageUrl
            });
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] favflicks.data.Dtos.UpdateProfileDto dto)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound();

            if (user.Profile == null)
            {
                user.Profile = new favflicks.data.Models.UserProfile
                {
                    UserId = userId,
                    JoinDate = DateTime.UtcNow
                };
                context.Set<favflicks.data.Models.UserProfile>().Add(user.Profile);
            }

            user.Profile.Bio = dto.Bio;
            user.Profile.Location = dto.Location;
            user.Profile.ProfilePictureUrl = dto.ProfilePictureUrl;

            await context.SaveChangesAsync();

            return Ok(new
            {
                userId = user.Id,
                userName = user.UserName,
                email = user.Email,
                bio = user.Profile.Bio,
                location = user.Profile.Location,
                joinDate = user.Profile.JoinDate,
                profilePictureUrl = user.Profile.ProfilePictureUrl,
                coverImageUrl = user.Profile.CoverImageUrl
            });
        }
    }
}
