using favflicks.data.Dtos;
using favflicks.data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.services.Interfaces
{
    public interface IAuthService
    {
        Task<(string? Token, string? Error)> RegisterAsync(RegisterDto dto);
        Task<(string? Token, AppUser User)> LoginAsync(LoginDto dto);
        Task<string?> ForgotPasswordAsync(ForgotPasswordDto dto);
        Task<(bool Success, string? Error)> ResetPasswordAsync(ResetPasswordDto dto);
    }
}
