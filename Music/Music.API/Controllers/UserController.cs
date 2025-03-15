using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Music.API.PostModel;
using Music.Core;
using Music.Core.DTOs;
using Music.Core.Entities;
using Music.Core.IServices;
using Music.Service.services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Music.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController(IUserService iservice, IMapper mapper,IS3Service s3Service) : ControllerBase
    {
        readonly IUserService _iService = iservice;
        readonly IMapper _mapper = mapper;
        readonly IS3Service _s3Service= s3Service;

        // GET: api/<UserController>
        [HttpGet]
        [Authorize(Policy = "Admin")]
        public async Task<IEnumerable<UserDto>> Get()
        {
            return await _iService.GetAsync();
        }
        [HttpGet("Full")]
        [Authorize(Policy ="Admin")]
        public async Task<IEnumerable<User>> GetFull()
        {
            return await _iService.GetFullAsync();
        }
        [HttpGet("PublicSong")]
        [AllowAnonymous]
        public async Task<IEnumerable<UserDto>> GetUsersWithPublicSongs()
        {
            return await _iService.GetUsersWithPublicSongsAsync();
        }
        // GET api/<UserControllers>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(int id)
        {
            UserDto userDto = await _iService.GetByIdAsync(id);
            if (userDto == null)
                return NotFound();
            return Ok(userDto);
        }
        [HttpGet("{id}/Full")]
        public async Task<ActionResult<User>> GetFull(int id)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != id)
                return Forbid();
            var user = await _iService.GetByIdFullAsync(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }
        // POST api/<UserControllers>
        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<UserDto>> Post([FromBody] UserPostModel userPostModel)
        {
            if (userPostModel == null)
                return BadRequest("User data is required.");

            var userDto = _mapper.Map<UserDto>(userPostModel);
            var result = await _iService.AddAsync(userDto);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);
            return Ok(result.Data);
        }

        // PUT api/<UserControllers>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Put(int id, [FromBody] UserPostModel userPostModel)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != id)
                return Forbid();
            if (userPostModel == null)
                return BadRequest("User data is required.");
            UserDto userDto = _mapper.Map<UserDto>(userPostModel);
            userDto = await _iService.UpdateAsync(id, userDto);
            if (userDto == null)
                return NotFound();
            return Ok(userDto);
        }

       // DELETE api/<UserControllers>/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]

        public async Task<ActionResult<bool>> Delete(int id)
        {
            return await _iService.DeleteAsync(id);
        }
        [HttpGet("followers")]
        public async Task<IEnumerable<User>> GetFollowers()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            return await _iService.GetFollowers(tokenId);
        }

        [HttpGet("upload-url")]
        [Authorize]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("Missing file name");
            var url = await _s3Service.GeneratePresignedUrlAsync("images/"+fileName, contentType);
            return Ok(new { url });
        }

        [HttpGet("download-url/{fileName}")]
        public async Task<IActionResult> GetDownloadUrl(string fileName)
        {
            var url = await _s3Service.GetDownloadUrlAsync(fileName);
            return Ok(new { downloadUrl = url });
        }
    }
}
