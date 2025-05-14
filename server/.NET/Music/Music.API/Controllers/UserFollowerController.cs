using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Music.API.PostModel;
using Music.Core;
using Music.Core.DTOs;
using Music.Core.IServices;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Music.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserFollowerController(IUserFollowerService iservice, IMapper mapper) : ControllerBase
    {
        readonly IUserFollowerService _iService = iservice;
        readonly IMapper _mapper = mapper;

        // GET: api/<UserFollowerController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<UserFollowerController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<UserFollowerController>
        [HttpPost]
        public async Task<ActionResult<UserFollowerDto>> Post([FromBody] UserFollowerPostModel userFollowerPostModel)
        {
            if (userFollowerPostModel == null)
                return BadRequest("data is required.");
            UserFollowerDto userFollowerDto = _mapper.Map<UserFollowerDto>(userFollowerPostModel);
            Result<UserFollowerDto> result = await _iService.AddAsync(userFollowerDto);
            if (!result.IsSuccess)
                return StatusCode(result.StatusCode, result.ErrorMessage);
            return Ok(result.Data);
        }

        // PUT api/<UserFollowerController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        // DELETE api/<UserFollowerController>/5
        [HttpDelete("{followee}")]
        public async Task<ActionResult<bool>> Delete(int followee)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            return await _iService.DeleteAsync(tokenId, followee);
        }
    }
}
