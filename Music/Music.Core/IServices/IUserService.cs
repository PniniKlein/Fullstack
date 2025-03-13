using Music.Core.DTOs;
using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IServices
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAsync();
        Task<IEnumerable<User>> GetFullAsync();
        Task<UserDto> GetByIdAsync(int id);
        Task<User?> GetByIdFullAsync(int id);
        Task<Result<UserDto>> AddAsync(UserDto attractionDto);
        Task<UserDto> UpdateAsync(int id, UserDto attractionDto);
        Task<IEnumerable<User>> GetFollowers(int userId);
        Task<bool> DeleteAsync(int id);
    }
}
