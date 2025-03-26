using Microsoft.EntityFrameworkCore;
using Music.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Music.Data.Repositories
{
    public class Repository<T>(DataContext dataContex) : IRepository<T> where T : class
    {
        protected readonly DbSet<T> _dataSet=dataContex.Set<T>();

        public async Task<IEnumerable<T>> GetAsync()
        {
            return await _dataSet.ToListAsync();
        }
        public async Task<T>? GetByIdAsync(int id)
        {
            return await _dataSet.FindAsync(id);
        }

        public async Task<T> AddAsync(T t)
        {
            await _dataSet.AddAsync(t);
            return t;
        }
        public async virtual Task<bool> DeleteAsync(int id)
        {
            T find = await _dataSet.FindAsync(id);
            if (find != null)
            {
                _dataSet.Remove(find);
                return true;
            }
            return false;
        }

        public virtual async Task<T> UpdateAsync(int id, T updatedEntity)
        {
            var existingEntity = await _dataSet.FindAsync(id);
            if (existingEntity == null)
            {
                return null;
            }
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                      .Where(prop => prop.Name != "Id" && prop.Name != "Create_at");

            foreach (var property in properties)
            {
                var updatedValue = property.GetValue(updatedEntity);
                if (updatedValue != null)
                {
                    property.SetValue(existingEntity, updatedValue);
                }
            }
            return existingEntity;
        }
    }
}
