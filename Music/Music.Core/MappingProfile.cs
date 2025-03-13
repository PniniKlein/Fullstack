using AutoMapper;
using Music.Core.DTOs;
using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDto>().ReverseMap();
            CreateMap<Song, SongDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UserFollower, UserFollowerDto>().ReverseMap();
        }
    }
}
