using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IRepositories
{
    public interface ICommentRepository:IRepository<Comment>
    {
        Task<IEnumerable<Comment>> GetFullAsync();
        Task<IEnumerable<Comment>> GetBySongIdFullAsync(int songId);
        Task<IEnumerable<Comment>> GetByUserIdAsync(int userId);
    }
}
