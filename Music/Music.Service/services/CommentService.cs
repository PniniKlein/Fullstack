using Music.Core.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Service.services
{
    public class CommentService:ICommentService
    {
        private readonly IRepositoryManager _iManager;
        private readonly IMapper _mapper;
        public AttractionService(IRepositoryManager iManager, IMapper mapper)
        {
            _iManager = iManager;
            _mapper = mapper;
        }
        public async Task<List<AttractionDto>> GetAsync()
        {
            List<Attraction> attractions = await _iManager.IAttractionRep.GetAsync();
            List<AttractionDto> attractionDtos = _mapper.Map<List<AttractionDto>>(attractions);
            return attractionDtos;
        }
        public async Task<List<Attraction>> GetAllAsync()
        {
            return await _iManager.IAttractionRep.GetAllAsync();
        }
        public async Task<AttractionDto>? GetByIdAsync(int id)
        {
            Attraction attraction = await _iManager.IAttractionRep.GetByIdAsync(id);
            AttractionDto attractionDto = _mapper.Map<AttractionDto>(attraction);
            return attractionDto;
        }

        public async Task<AttractionDto> AddAsync(AttractionDto attractionDto)
        {
            Attraction attraction = _mapper.Map<Attraction>(attractionDto);
            attraction = await _iManager.IAttractionRep.AddAsync(attraction);
            if (attraction != null)
                await _iManager.SaveAsync();
            attractionDto = _mapper.Map<AttractionDto>(attraction);
            return attractionDto;
        }
        public async Task<AttractionDto> UpdateAsync(int id, AttractionDto attractionDto)
        {
            Attraction attraction = _mapper.Map<Attraction>(attractionDto);
            attraction = await _iManager.IAttractionRep.UpdateAsync(id, attraction);
            if (attraction != null)
                await _iManager.SaveAsync();
            attractionDto = _mapper.Map<AttractionDto>(attraction);
            return attractionDto;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            bool flag = await _iManager.IAttractionRep.DeleteAsync(id);
            if (flag)
                await _iManager.SaveAsync();
            return flag;
        }
    }
}
