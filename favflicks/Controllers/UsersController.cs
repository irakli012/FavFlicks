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
    }
}
