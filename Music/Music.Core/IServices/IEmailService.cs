using Music.Core.Entities;
using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IServices
{
    public interface IEmailService
    {
        public Task<bool> SendEmailAsync(EmailRequest request);
        //public Task<bool> SendNewSongNotificationAsync(User artist, Song song, List<User> followers);
    }
}
