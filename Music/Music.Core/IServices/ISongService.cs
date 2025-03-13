﻿using Music.Core.DTOs;
using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IServices
{
    public interface ISongService
    {
        Task<IEnumerable<SongDto>> GetAsync();
        Task<IEnumerable<Song>> GetFullAsync();
        Task<IEnumerable<SongDto>> GetPublicAsync();
        Task<IEnumerable<SongDto>> GetByCategoryPublicAsync(string gener);
        Task<IEnumerable<Song>> GetByUserIdAsync(int userId);
        Task<SongDto> GetByIdAsync(int id);
        Task<SongDto> AddAsync(SongDto attractionDto);
        Task<SongDto> UpdateAsync(int id, SongDto attractionDto);
        Task<SongDto> UpdatePublicAsync(int id);
        Task<bool> DeleteAsync(int id);
    }
}
