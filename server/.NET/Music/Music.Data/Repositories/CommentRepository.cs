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
    public class CommentRepository:Repository<Comment>,ICommentRepository
    {
        public CommentRepository(DataContext dataContex) : base(dataContex)
        {

        }
        public async Task<IEnumerable<Comment>> GetFullAsync()
        {
            return await _dataSet.Include(x => x.User).ToListAsync();
        }
        public async Task<IEnumerable<Comment>> GetBySongIdFullAsync(int songId)
        {
            return await _dataSet.Where(x=>x.SongId==songId).Include(x => x.User).OrderByDescending(x => x.Create_at).ToListAsync();
        }
        public async Task<IEnumerable<Comment>> GetByUserIdAsync(int userId)
        {
            return await _dataSet.Where(x => x.UserId == userId).ToListAsync();
        }
    }
}
