using Microsoft.AspNetCore.Mvc;
using Music.Core.IServices;
using Recipes.Core.Entities;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Music.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController(IEmailService emailService, IUserService userService) : ControllerBase
    {
        private readonly IEmailService _emailService = emailService;
        private readonly IUserService _userService = userService;

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            await _emailService.SendEmailAsync(request);
            return Ok();
        }
    }
}
