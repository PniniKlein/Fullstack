using Music.Core.DTOs;
using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IServices
{
    public interface IAuthService
    {
        string GenerateJwtToken(User user);
        bool ValidateUser(string email, string password, out string[] roles, out User user);
        Result<LoginResponseDto?> Login(string email, string password);
        Task<Result<LoginResponseDto>> Register(UserDto userDto);
    }
}
