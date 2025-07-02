using favflicks.data.Dtos;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace favflicks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var token = await authService.RegisterAsync(dto);
            if (token != null)
                return BadRequest("registration failed");
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var token = await authService.LoginAsync(dto);
            if (token == null) return Unauthorized();
            return Ok(new { token });
        }

    }
}
