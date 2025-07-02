using favflicks.data.Dtos;
using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.services
{
    public class AuthService(UserManager<AppUser> userManager, IConfiguration config) : IAuthService
    {
        public async Task<string?> RegisterAsync(RegisterDto dto)
        {
            var user = new AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email
            };

            var result = await userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                // Log the real errors to console
                var errorMessage = string.Join("; ", result.Errors.Select(e => e.Description));
                Console.WriteLine("Registration failed: " + errorMessage);
                return null;
            }

            return GenerateJwtToken(user);
        }

        public async Task<string?> LoginAsync(LoginDto dto)
        {
            var user = await userManager.FindByNameAsync(dto.UserName);
            if (user == null || !await userManager.CheckPasswordAsync(user, dto.Password))
                return null;

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(AppUser user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName!),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(Convert.ToDouble(config["Jwt:ExpireDays"] ?? "7")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
    