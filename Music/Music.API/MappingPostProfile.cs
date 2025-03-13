using AutoMapper;
using Music.API.PostModel;
using Music.Core.DTOs;

namespace Music.API
{
    public class MappingPostProfile : Profile
    {
        public MappingPostProfile()
        {
            CreateMap<CommentPostModel, CommentDto>();
            CreateMap<SongPostModel, SongDto>();
            CreateMap<UserFollowerPostModel, UserFollowerDto>();
            CreateMap<UserPostModel, UserDto>();
        }
    }
}
