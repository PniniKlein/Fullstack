using AutoMapper;
using Music.Core;
using Music.Core.DTOs;
using Music.Core.Entities;
using Music.Core.IRepositories;
using Music.Core.IServices;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Music.Service.services
{
    public class UserService(IRepositoryManager iManager, IMapper mapper) : IUserService
    {
        private readonly IRepositoryManager _iManager = iManager;
        private readonly IMapper _mapper = mapper;
        
        public async Task<IEnumerable<UserDto>> GetAsync()
        {
            var users = await _iManager._userRepository.GetAsync();
            var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);
            return userDtos;
        }
        public async Task<IEnumerable<User>> GetFullAsync()
        {
            return await _iManager._userRepository.GetFullAsync();
        }
        public async Task<IEnumerable<UserDto>> GetUsersWithPublicSongsAsync()
        {
            var users = await _iManager._userRepository.GetUsersWithPublicSongsAsync();
            var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);
            return userDtos;
        }
        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _iManager._userRepository.GetByIdAsync(id);
            var userDto = _mapper.Map<UserDto>(user);
            return userDto;
        }
        public async Task<User> GetByIdFullAsync(int id)
        {
            var user = await _iManager._userRepository.GetByIdFullAsync(id);
            return user;
        }

        public async Task<User> GetByIdFullPublicAsync(int id)
        {
            var user = await _iManager._userRepository.GetByIdFullPublicAsync(id);
            return user;
        }
        public async Task<Result<UserDto>> AddAsync(UserDto userDto)
        {
            if (!IsValidEmail(userDto.Email))
                return Result<UserDto>.BadRequest("Invalid email");
            if (!IsValidPassword(userDto.Password))
                return Result<UserDto>.BadRequest("Invalid Password");
            var user = _mapper.Map<User>(userDto);
            if (await _iManager._userRepository.ExistsAsync(userDto.Email))
                return Result<UserDto>.Failure("user already exist");
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            user.Create_at = DateTime.UtcNow;
            user = await _iManager._userRepository.AddAsync(user);
            if (user == null)
                return Result<UserDto>.Failure("unable to add the user this time");
            await _iManager.SaveAsync();
            userDto = _mapper.Map<UserDto>(user);
            return Result<UserDto>.Success(userDto); ;
        }
        public async Task<UserDto> UpdateAsync(int id, UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            //user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            user = await _iManager._userRepository.UpdateAsync(id, user);
            if (user != null)
                await _iManager.SaveAsync();
            userDto = _mapper.Map<UserDto>(user);
            return userDto;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var userToDelete = await _iManager._userRepository.GetUserWithFolowee(id);
            if (userToDelete == null)
                return false;

            foreach (var item in userToDelete.Followers)
            {
               await _iManager._userFollowersRepository.DeleteAsync(item.Id);
            }

            var comments =await _iManager._commentRepository.GetByUserIdAsync(id);
            foreach (var comment in comments)
            {
               await _iManager._commentRepository.DeleteAsync(comment.Id);
            }
            await _iManager._userRepository.DeleteAsync(id);

            await _iManager.SaveAsync();
            return true;
        }
        public async Task<IEnumerable<User>> GetFollowers(int userId)
        {
            return await _iManager._userFollowersRepository.GetFollowers(userId);
        }
        private static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase);
        }
        public bool IsValidPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
                return false;
            bool hasLetter = password.Any(char.IsLetter);
            bool hasDigit = password.Any(char.IsDigit);
            return hasLetter && hasDigit;
        }

    }
}
