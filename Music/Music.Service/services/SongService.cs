using AutoMapper;
using Music.Core.DTOs;
using Music.Core.Entities;
using Music.Core.IRepositories;
using Music.Core.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Music.Service.services
{
    public class SongService(IRepositoryManager iManager, IMapper mapper) :ISongService
    {
        private readonly IRepositoryManager _iManager = iManager;
        private readonly IMapper _mapper = mapper;

        public async Task<IEnumerable<SongDto>> GetAsync()
        {
            IEnumerable<Song> songs = await _iManager._songRepository.GetAsync();
            IEnumerable<SongDto> songDtos = _mapper.Map<IEnumerable<SongDto>>(songs);
            return songDtos;
        }
        public async Task<IEnumerable<Song>> GetFullAsync()
        {
            return await _iManager._songRepository.GetFullAsync();
        }
        public async Task<IEnumerable<SongDto>> GetPublicAsync()
        {
            IEnumerable<Song> songs = await _iManager._songRepository.GetPublicAsync();
            IEnumerable<SongDto> songDtos = _mapper.Map<IEnumerable<SongDto>>(songs);
            return songDtos;
        }
        public async Task<IEnumerable<SongDto>> GetByCategoryPublicAsync(string gener)
        {
            IEnumerable<Song> songs = await _iManager._songRepository.GetByCategoryPublicAsync(gener);
            IEnumerable<SongDto> songDtos = _mapper.Map<IEnumerable<SongDto>>(songs);
            return songDtos;
        }

        public async Task<IEnumerable<Song>> GetByUserIdAsync(int userId)
        {
            return await _iManager._songRepository.GetByUserIdAsync(userId);
        }
        public async Task<Song>? GetByIdFullAsync(int id)
        {
            Song song = await _iManager._songRepository.GetByIdFullAsync(id);
            //SongDto songDto = _mapper.Map<SongDto>(song);
            return song;
        }

        public async Task<SongDto>? GetByIdAsync(int id)
        {
            Song song = await _iManager._songRepository.GetByIdAsync(id);
            SongDto songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }

        public async Task<SongDto> AddAsync(SongDto songDto)
        {
            Song song = _mapper.Map<Song>(songDto);
            song.Create_at = DateTime.UtcNow;
            song = await _iManager._songRepository.AddAsync(song);
            if (song != null)
                await _iManager.SaveAsync();
            songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }
        public async Task<SongDto> UpdateAsync(int id, SongDto songDto)
        {
            Song song = _mapper.Map<Song>(songDto);
            song = await _iManager._songRepository.UpdateAsync(id, song);
            if (song != null)
                await _iManager.SaveAsync();
            songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }
        public async Task<SongDto> UpdatePublicAsync(int id)
        {
            Song song = await _iManager._songRepository.UpdatePublicAsync(id);
            if (song != null)
                await _iManager.SaveAsync();
            SongDto songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var comments = await _iManager._commentRepository.GetBySongIdFullAsync(id);

            if (comments != null)
            {
                foreach (var comment in comments)
                {
                    await _iManager._commentRepository.DeleteAsync(comment.Id);
                }
            }
            var flag =await _iManager._songRepository.DeleteAsync(id);
            if (flag)
                await _iManager.SaveAsync();
            return flag;
        }
        //public List<string> GetGenerTypes()
        //{
        //    return _iManager._songRepository.GetGenerTypes();
        //}
    }
}
