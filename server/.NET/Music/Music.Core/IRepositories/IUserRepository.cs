using Music.Core.DTOs;
using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IRepositories
{
    public interface IUserRepository:IRepository<User>
    {
        Task<IEnumerable<User>> GetFullAsync();
        Task<UserWithFollowees> GetByIdFullAsync(int id);
        Task<User> GetByIdFullPublicAsync(int id);
        User? GetUserWithRoles(string email);
        Task<(int Id, string PasswordHash)?> GetPasswordAndIdByEmailAsync(string email);
        Task<User?> GetUserWithFolowee(int id);
        Task<IEnumerable<User>> GetUsersWithPublicSongsAsync();
        Task<bool> ExistsAsync(string email);
        Task<string> GetUserNameByIdAsync(int userId);
    }
}
