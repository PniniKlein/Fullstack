using Microsoft.EntityFrameworkCore;
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
            return await _dataSet.Include(x => x.Songs).ToListAsync();
        }

        public async Task<User?> GetByIdFullAsync(int id)
        {
            return await _dataSet.Where(x => x.Id == id).Include(x => x.Songs).FirstOrDefaultAsync();
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
    }
}
