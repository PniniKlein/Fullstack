using Music.Core.DTOs;
using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IServices
{
    public interface IUserFollowerService
    {
       Task<Result<UserFollowerDto>> AddAsync(UserFollowerDto userFollowerDto);
       Task<bool> DeleteAsync(int followerId,int followeeId);
    }
}
