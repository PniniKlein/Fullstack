using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Music.API.PostModel;
using Music.Core.DTOs;
using Music.Core.Entities;
using Music.Core.IServices;
using Music.Service.services;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Music.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SongController(ISongService iservice, IMapper mapper, IS3Service s3Service) : ControllerBase
    {
        readonly ISongService _iService = iservice;
        readonly IMapper _mapper = mapper;
        readonly IS3Service _s3Service = s3Service;

        // GET: api/<SongController>
        [HttpGet]
        [Authorize(Policy = "Admin")]
        public async Task<IEnumerable<SongDto>> Get()
        {
            return await _iService.GetAsync();
        }
        [HttpGet("Full")]
        [Authorize(Policy = "Admin")]
        public async Task<IEnumerable<Song>> GetFull()
        {
            return await _iService.GetFullAsync();
        }
        [HttpGet("Public")]
        [AllowAnonymous]
        public async Task<IEnumerable<SongDto>> GetPublic()
        {
            return await _iService.GetPublicAsync();
        }
        [HttpGet("Category/{gener}")]
        public async Task<IEnumerable<SongDto>> GetByCategoryPublic(string gener)
        {
            return await _iService.GetByCategoryPublicAsync(gener);
        }
        [HttpGet("User/{userId}")]
        public async Task<IEnumerable<Song>> GetByUserId(int userId)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != userId)
                return null;
            return await _iService.GetByUserIdAsync(userId);
        }

        [HttpGet("UserFull/{userId}")]
        public async Task<IEnumerable<Song>> GetByUserFullId(int userId)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != userId)
                return null;
            return await _iService.GetByUserIdFullAsync(userId);
        }
        [HttpGet("{id}/Full")]
        [AllowAnonymous]
        public async Task<ActionResult<Song>> Get(int id)
        {
            Song song=await _iService.GetByIdFullAsync(id);
            if (song == null)
                return NotFound();
            return Ok(song);
        }

        //public async Task<IEnumerable<Song>> GetByEnum(int userId)
        //{
        //    return await _iService.GetByUserId(userId);
        //}
        // GET api/<SongController>/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<SongDto>> Get(int id)
        //{
        //    SongDto songDto = await _iService.GetByIdAsync(id);
        //    if (songDto == null)
        //        return NotFound();
        //    return songDto;
        //}

        // POST api/<SongController>
        [HttpPost]
        public async Task<ActionResult<SongDto>> Post([FromBody] SongPostModel songPostModel)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != songPostModel.UserId)
                return Forbid();
            SongDto songDto = _mapper.Map<SongDto>(songPostModel);
            songDto = await _iService.AddAsync(songDto);
            if (songDto == null)
                return NotFound();
            return songDto;
        }
        // PUT api/<SongController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SongDto>> Put(int id, [FromBody] SongPostModel songPostModel)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != songPostModel.UserId)
                return Forbid();
            SongDto songDto = _mapper.Map<SongDto>(songPostModel);
            songDto = await _iService.UpdateAsync(id, songDto);
            if (songDto == null)
                return NotFound();
            return songDto;
        }
        [HttpPut("{id}/Public")]
        public async Task<ActionResult<SongDto>> UpdatePublic(int id)
        {
            var song = await _iService.GetByIdAsync(id);
            if (song == null)
                return NotFound();
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != song.UserId)
                return Forbid();
            SongDto songDto = await _iService.UpdatePublicAsync(id);
            if (songDto == null)
                return NotFound();
            return songDto;
        }
        [HttpPut("{id}/Play")]
        [AllowAnonymous]
        public async Task<ActionResult<SongDto>> AddPlay(int id)
        {
            var song = await _iService.GetByIdAsync(id);
            if (song == null)
                return NotFound();
            SongDto songDto = await _iService.AddPlayAsync(id);
            if (songDto == null)
                return NotFound();
            return songDto;
        }

        [HttpPut("{id}/Lyrics")]
        [AllowAnonymous]
        public async Task<ActionResult<SongDto>> AddLyrics(int id,[FromBody] string lyrics)
        {
            var song = await _iService.GetByIdAsync(id);
            if (song == null)
                return NotFound();
            SongDto songDto = await _iService.AddLyricsAsync(id,lyrics);
            if (songDto == null)
                return NotFound();
            return songDto;
        }
        // DELETE api/<SongController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteAsync(int id)
        {
            //var song = await _iService.GetByIdAsync(id);
            //if (song == null)
            //    return NotFound();
            //var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            //var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            //if (tokenId != song.UserId)
            //    return Forbid();
            //return await _iService.DeleteAsync(id);
            var song = await _iService.GetByIdAsync(id);
            if (song == null)
                return NotFound();

            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            var userRole = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            // מתיר רק לבעל השיר או למנהל
            if (tokenId != song.UserId && userRole != "Admin")
                return Forbid();

            return await _iService.DeleteAsync(id);
        }
        //[HttpGet("Category")]
        //[AllowAnonymous]
        //public List<string> GetGenerTypes()
        //{
        //    return _iService.GetGenerTypes();
        //}
        [HttpGet("upload-url")]
        [Authorize]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("Missing file name");
            var url = await _s3Service.GeneratePresignedUrlAsync("songs/" + fileName, contentType);
            return Ok(new { url });
        }

        [HttpGet("download-url/{fileName}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDownloadUrl(string fileName)
        {
            var url = await _s3Service.GetDownloadUrlAsync(fileName);
            return Ok(new { downloadUrl = url });
        }
    }
}
