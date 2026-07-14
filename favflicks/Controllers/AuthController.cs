using favflicks.data.Dtos;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace favflicks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [Authorize]
        [HttpGet("test-auth")]
        public IActionResult TestAuth()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Ok($"You're authorized as user {userId}");
        }   

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var (token, error) = await authService.RegisterAsync(dto);
            if (token == null) return BadRequest(new { message = error ?? "Registration failed." });
            return Ok(new { token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var (token, user) = await authService.LoginAsync(dto);
            if (token == null) return Unauthorized();

            return Ok(new
            {
                token,
                user = new
                {
                    userName = user.UserName,
                    email = user.Email
                }
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var token = await authService.ForgotPasswordAsync(dto);
            if (token == null)
            {
                // To prevent email enumeration, we still return Ok or a generic message.
                // However, for development, we can just return the token if it exists.
                return Ok(new { message = "If the email is registered, a password reset link has been sent." });
            }

            // For development: return the token directly so frontend can use it.
            return Ok(new { token });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var (success, error) = await authService.ResetPasswordAsync(dto);
            if (!success) return BadRequest(new { message = error ?? "Failed to reset password." });
            return Ok(new { message = "Password reset successfully." });
        }

    }
}
