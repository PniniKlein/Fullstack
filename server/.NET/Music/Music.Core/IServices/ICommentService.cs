using Music.Core.DTOs;
using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IServices
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentDto>> GetAsync();
        Task<IEnumerable<Comment>> GetFullAsync();
        Task<IEnumerable<Comment>> GetBySongIdFullAsync(int songId);
        Task<CommentDto> GetByIdAsync(int id);
        Task<CommentDto> AddAsync(CommentDto attractionDto);
        Task<CommentDto> UpdateAsync(int id, CommentDto attractionDto);
        Task<bool> DeleteAsync(int id);
    }
}
