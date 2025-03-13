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
        Task<User> GetByIdFullAsync(int id);
        User? GetUserWithRoles(string email);
        Task<User?> GetUserWithFolowee(int id);
    }
}
