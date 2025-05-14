using Microsoft.EntityFrameworkCore;
using Music.Core.Entities;
using Music.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Data.Repositories
{
    public class UserFollowersRepository : Repository<UserFollower>, IUserFollowersRepository
    {
        public UserFollowersRepository(DataContext dataContex) : base(dataContex)
        {
        }
        public async Task<UserFollower> GetByAsync(int followerId, int followeeId)
        {
            var follow = await _dataSet.FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId);
            return follow;
        }

        public async Task<bool> DeleteAsync(int followerId, int followeeId)
        {
            var follow = await _dataSet.FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId);

            if (follow != null)
            {
                _dataSet.Remove(follow);
                return true;
            }
            return false;
        }
        public async Task<IEnumerable<User>> GetFollowers(int userId)
        {
            var followers = await _dataSet
                .Where(uf => uf.FolloweeId == userId) // מחפש את כל מי שעוקב אחרי ה-UserId
                .Select(uf => uf.Follower) // מחזיר את המשתמשים שעוקבים
                .ToListAsync();
            return followers;
        }

        public async Task<List<string>> GetEmailsOfFollowersAsync(int userId)
        {
            var followerEmails = await _dataSet
                .Where(uf => uf.FolloweeId == userId) 
                .Select(uf => uf.Follower.Email)     
                .ToListAsync();                      

            return followerEmails;
        }
    }
}
