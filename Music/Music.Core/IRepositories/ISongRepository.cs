﻿using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IRepositories
{
    public interface ISongRepository : IRepository<Song>
    {
        Task<IEnumerable<Song>> GetFullAsync();
        Task<IEnumerable<Song>> GetPublicAsync();
        Task<IEnumerable<Song>> GetByCategoryPublicAsync(string gener);
        Task<IEnumerable<Song>> GetByUserIdAsync(int userId);
        Task<Song> UpdatePublicAsync(int id);
        Task<Song> GetByIdFullAsync(int id);
        //List<string> GetGenerTypes();
    }
}
