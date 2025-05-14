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

namespace Music.Service.services
{
    public class CommentService(IRepositoryManager iManager, IMapper mapper) :ICommentService
    {
        private readonly IRepositoryManager _iManager = iManager;
        private readonly IMapper _mapper = mapper;
        public async Task<IEnumerable<CommentDto>> GetAsync()
        {
            IEnumerable<Comment> comments = await _iManager._commentRepository.GetAsync();
            IEnumerable<CommentDto> commetDtos = _mapper.Map<IEnumerable<CommentDto>>(comments);
            return commetDtos;
        }
        public async Task<IEnumerable<Comment>> GetFullAsync()
        {
            return await _iManager._commentRepository.GetFullAsync();
        }
        public async Task<IEnumerable<Comment>> GetBySongIdFullAsync(int songId)
        {
            return await _iManager._commentRepository.GetBySongIdFullAsync(songId);
        }
        public async Task<CommentDto>? GetByIdAsync(int id)
        {
            Comment comment = await _iManager._commentRepository.GetByIdAsync(id);
            CommentDto commentDto = _mapper.Map<CommentDto>(comment);
            return commentDto;
        }

        public async Task<CommentDto> AddAsync(CommentDto commentDto)
        {
            Comment comment = _mapper.Map<Comment>(commentDto);
            comment.Create_at = DateTime.UtcNow;
            comment = await _iManager._commentRepository.AddAsync(comment);
            if (comment != null)
                await _iManager.SaveAsync();
            commentDto = _mapper.Map<CommentDto>(comment);
            return commentDto;
        }
        public async Task<CommentDto> UpdateAsync(int id, CommentDto attractionDto)
        {
            Comment comment = _mapper.Map<Comment>(attractionDto);
            comment = await _iManager._commentRepository.UpdateAsync(id, comment);
            if (comment != null)
                await _iManager.SaveAsync();
            attractionDto = _mapper.Map<CommentDto>(comment);
            return attractionDto;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            bool flag = await _iManager._commentRepository.DeleteAsync(id);
            if (flag)
                await _iManager.SaveAsync();
            return flag;
        }
    }
}
