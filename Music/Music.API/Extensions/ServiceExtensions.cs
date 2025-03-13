using Microsoft.EntityFrameworkCore;
using Music.API;
using Music.Core;
using Music.Core.IRepositories;
using Music.Core.IServices;
using Music.Data.Repositories;
using Music.Service.services;

namespace Music.Api.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddDependencyInjectoions(this IServiceCollection services)
        {

            services.AddAutoMapper(typeof(MappingProfile), typeof(MappingPostProfile));

            // Register repositories
            services.AddScoped<IRepositoryManager, RepositoryManager>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<ICommentRepository, CommentRepository>();
            services.AddScoped<ISongRepository, SongRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserFollowersRepository, UserFollowersRepository>();

            // Register services
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<ISongService, SongService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserFollowerService, UserFollowerService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IS3Service, S3Service>();
        }


    }
}
