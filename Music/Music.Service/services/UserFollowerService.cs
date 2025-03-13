using AutoMapper;
using Music.Core;
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
    public class UserFollowerService(IRepositoryManager iManager, IMapper mapper) : IUserFollowerService
    {
        private readonly IRepositoryManager _iManager = iManager;
        private readonly IMapper _mapper = mapper;

        public async Task<Result<UserFollowerDto>> AddAsync(UserFollowerDto userFollowerDto)
        {
            var follow = await _iManager._userFollowersRepository.GetByAsync(userFollowerDto.FollowerId, userFollowerDto.FolloweeId);
            if (follow != null)
                return Result<UserFollowerDto>.Failure("You are already followee");
            UserFollower userFollower = _mapper.Map<UserFollower>(userFollowerDto);
            userFollower = await _iManager._userFollowersRepository.AddAsync(userFollower);
            if (userFollower == null)
                return Result<UserFollowerDto>.Failure("unable to add the follow this time");
            await _iManager.SaveAsync();
            userFollowerDto = _mapper.Map<UserFollowerDto>(userFollower);
            return Result<UserFollowerDto>.Success(userFollowerDto);
        }

        public async Task<bool> DeleteAsync(int followerId, int followeeId)
        {
            bool flag = await _iManager._userFollowersRepository.DeleteAsync(followerId, followeeId);
            if (flag)
                await _iManager.SaveAsync();
            return flag;
        }
    }
}
