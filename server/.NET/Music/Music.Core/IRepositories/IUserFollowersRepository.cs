using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IRepositories
{
    public interface IUserFollowersRepository : IRepository<UserFollower>
    {
        Task<UserFollower> GetByAsync(int followerId, int followeeId);
        Task<bool> DeleteAsync(int followerId, int followeeId);
        Task<IEnumerable<User>> GetFollowers(int userId);
        Task<List<string>> GetEmailsOfFollowersAsync(int userId);
    }
}
