using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Music.API.PostModel;
using Music.Core.DTOs;
using Music.Core.Entities;
using Music.Core.IServices;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Music.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CommentController(ICommentService iservice, IMapper mapper) : ControllerBase
    {
        readonly ICommentService _iService= iservice;
        readonly IMapper _mapper= mapper;

        // GET: api/<CommentController>
        [HttpGet]
        [Authorize(Policy = "Admin")]
        public async Task<IEnumerable<CommentDto>> Get()
        {
            return await _iService.GetAsync();
        }
        [HttpGet("Full")]
        [Authorize(Policy = "Admin")]
        public async Task<IEnumerable<Comment>> GetFull()
        {
            return await _iService.GetFullAsync();
        }
        // GET api/<CommentController>/5
        [HttpGet("Song/{songId}")]
        [AllowAnonymous]
        public async Task<IEnumerable<Comment>> GetBySongIdFull(int songId)
        {
            return await _iService.GetBySongIdFullAsync(songId);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CommentDto>> Get(int id)
        {
            CommentDto commentDto = await _iService.GetByIdAsync(id);
            if (commentDto == null)
                return NotFound();
            return commentDto;
        }
        // POST api/<CommentController>
        [HttpPost]
        public async Task<ActionResult<CommentDto>> Post([FromBody] CommentPostModel commentPostModel)
        {
            if (commentPostModel == null)
                return BadRequest("Comment data is required.");
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != commentPostModel.UserId)
                return Forbid();
            CommentDto commentDto = _mapper.Map<CommentDto>(commentPostModel);
            commentDto = await _iService.AddAsync(commentDto);
            if (commentDto == null)
                return NotFound();
            return commentDto;
        }

        // PUT api/<CommentController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<CommentDto>> Put(int id, [FromBody] CommentPostModel commentPostModel)
        {
            if (commentPostModel == null)
                return BadRequest("Comment data is required.");
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != id)
                return Forbid();
            CommentDto commentDto = _mapper.Map<CommentDto>(commentPostModel);
            commentDto = await _iService.UpdateAsync(id, commentDto);
            if (commentDto == null)
                return NotFound();
            return commentDto;
        }

        // DELETE api/<CommentController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            var comment = await _iService.GetByIdAsync(id);
            if (tokenId != comment.UserId)
                return Forbid();
            return await _iService.DeleteAsync(id);
        }
    }
}
