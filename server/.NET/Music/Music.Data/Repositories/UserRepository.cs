using Microsoft.EntityFrameworkCore;
using Music.Core.DTOs;
using Music.Core.Entities;
using Music.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Data.Repositories
{
    public class UserRepository:Repository<User>,IUserRepository
    {
        public UserRepository(DataContext dataContex) : base(dataContex)
        {
        }

        public async Task<IEnumerable<User>> GetFullAsync()
        {
            return await _dataSet.Include(x => x.Songs).Include(x => x.Followees)
            .ThenInclude(f => f.Followee).ToListAsync();
        }

        public async Task<UserWithFollowees?> GetByIdFullAsync(int id)
        {
            return await _dataSet
                .Where(x => x.Id == id)
                .Include(x => x.Songs)
                .Select(x => new UserWithFollowees
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    Email = x.Email,
                    Password = x.Password,
                    PathProfile = x.PathProfile,
                    Create_at = x.Create_at,
                    Songs = x.Songs,
                    Followees = x.Followees.Select(f => f.FolloweeId).ToList(),  // החזרת רק ה־ID של ה-Followees
                    RoleList = x.RoleList
                })
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetByIdFullPublicAsync(int id)
        {
            return await _dataSet.Where(x => x.Id == id)
                .Include(x => x.Songs.Where(s => s.IsPublic))
                .Include(x => x.Followees)
            .ThenInclude(f => f.Followee)
            .FirstOrDefaultAsync();
        }

        public User? GetUserWithRoles(string email)
        {
            return _dataSet.Where(u => u.Email == email)
                .Include(u => u.RoleList).Include(u=>u.Songs).FirstOrDefault();
        }

        public async Task<User?> GetUserWithFolowee(int id)
        {
            return await _dataSet
             .Include(u => u.Followers)
             .FirstOrDefaultAsync(u => u.Id == id);
        }
        public async Task<IEnumerable<UserWithCountSong>> GetUsersWithPublicSongsAsync()
        {
            return await _dataSet
                .Where(u => u.Songs.Any(s => s.IsPublic))
                .Select(x => new UserWithCountSong
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    Email = x.Email,
                    Password = x.Password,
                    PathProfile = x.PathProfile,
                    Create_at = x.Create_at,
                    CountSongs = x.Songs.Count(s => s.IsPublic),
                    CountFollowers = x.Followers.Count,
                    RoleList = x.RoleList
                })
                .ToListAsync();
        }

        public async Task<bool> ExistsAsync(string email)
        {
            return await _dataSet.AnyAsync(u => u.Email == email);
        }
        public async Task<(int Id, string PasswordHash)?> GetPasswordAndIdByEmailAsync(string email)
        {
            return await _dataSet
                .Where(u => u.Email == email)
                .Select(u => new ValueTuple<int, string>(u.Id, u.Password))
                .FirstOrDefaultAsync();
        }
        public async Task<string> GetUserNameByIdAsync(int userId)
        {
            var user = await _dataSet
                .Where(u => u.Id == userId)
                .Select(u => u.UserName)
                .FirstOrDefaultAsync();

            return user;
        }
    }
}
