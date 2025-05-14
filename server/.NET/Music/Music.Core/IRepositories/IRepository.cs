using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IRepositories
{
    public interface IRepository<T>
    {
        Task<IEnumerable<T>> GetAsync();
        Task<T> GetByIdAsync(int id);
        Task<T> AddAsync(T user);
        Task<T> UpdateAsync(int id, T user);
        Task<bool> DeleteAsync(int id);
    }
}
