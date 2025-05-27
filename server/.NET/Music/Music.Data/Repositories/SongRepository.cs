using Microsoft.EntityFrameworkCore;
using Music.Core.DTOs;
using Music.Core.Entities;
using Music.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Music.Data.Repositories
{
    public class SongRepository:Repository<Song>,ISongRepository
    {
        public SongRepository(DataContext dataContex) : base(dataContex)
        {
        }
        public async Task<IEnumerable<Song>> GetFullAsync()
        {
            return await _dataSet.Include(s => s.Comments.OrderByDescending(c => c.Create_at)) // מיון התגובות בסדר יורד לפי תאריך יצירה
                .ThenInclude(c => c.User).ToListAsync();
        }
        public async Task<IEnumerable<Song>> GetPublicAsync()
        {
            return await _dataSet.Where(x => x.IsPublic == true).Include(x => x.Comments).ToListAsync();
        }
        public async Task<IEnumerable<Song>> GetByCategoryPublicAsync(string gener)
        {
                return await _dataSet.Where(c => c.Gener == gener && c.IsPublic==true).ToListAsync();
        }
        public async Task<IEnumerable<Song>> GetByUserIdAsync(int userId)
        {
           return await _dataSet.Where(x => x.UserId == userId).ToListAsync();
        }
        public async Task<IEnumerable<Song>> GetByUserIdFullAsync(int userId)
        {
            return await _dataSet.Where(x => x.UserId == userId && x.IsPublic).Include(s => s.Comments.OrderByDescending(c => c.Create_at)) // מיון התגובות בסדר יורד לפי תאריך יצירה
                .ThenInclude(c => c.User).ToListAsync();
        }
        public async Task<Song?> GetByIdFullAsync(int id)
        {
            return await _dataSet
                .Where(s => s.Id == id)
                .Include(s => s.Comments.OrderByDescending(c => c.Create_at)) // מיון התגובות בסדר יורד לפי תאריך יצירה
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync();
        }
        //public override async Task<Song> UpdateAsync(int id, Song updatedEntity)
        //{
        //    var existingEntity = await _dataSet.FindAsync(id);
        //    if (existingEntity == null)
        //    {
        //        return null;
        //    }
        //    var properties = typeof(SongRepository).GetProperties(BindingFlags.Public | BindingFlags.Instance)
        //                              .Where(prop => prop.Name != "Id" && prop.Name!="Like");

        //    foreach (var property in properties)
        //    {
        //        var updatedValue = property.GetValue(updatedEntity);
        //        if (updatedValue != null)
        //        {
        //            property.SetValue(existingEntity, updatedValue);
        //        }
        //    }
        //    return existingEntity;
        //}
        public async Task<Song> UpdatePublicAsync(int id)
        {
            var existingEntity = await _dataSet.FindAsync(id);
            if (existingEntity == null)
            {
                return null;
            }
            existingEntity.IsPublic = true;
            return existingEntity;
        }
        public async Task<Song> AddPlayAsync(int id)
        {
            var existingEntity = await _dataSet.FindAsync(id);
            if (existingEntity == null)
            {
                return null;
            }
            existingEntity.Plays++;
            return existingEntity;
        }

        public async Task<Song> AddLyricsAsync(int id,string lyrics)
        {
            var existingEntity = await _dataSet.FindAsync(id);
            if (existingEntity == null)
            {
                return null;
            }
            existingEntity.Lyrics = lyrics;
            return existingEntity;
        }
        //public List<string> GetGenerTypes()
        //{
        //    return Enum.GetValues(typeof(GenerType))
        //               .Cast<GenerType>()
        //               .Select(g => g.ToString())
        //               .ToList();
        //}
    }
}
