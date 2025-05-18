using AutoMapper;
using Music.Core.DTOs;
using Music.Core.Entities;
using Music.Core.IRepositories;
using Music.Core.IServices;
using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Music.Service.services
{
    public class SongService(IRepositoryManager iManager, IMapper mapper,IEmailService iEmailService) :ISongService
    {
        private readonly IRepositoryManager _iManager = iManager;
        private readonly IMapper _mapper = mapper;
        private readonly IEmailService iEmailService = iEmailService;

        public async Task<IEnumerable<SongDto>> GetAsync()
        {
            IEnumerable<Song> songs = await _iManager._songRepository.GetAsync();
            IEnumerable<SongDto> songDtos = _mapper.Map<IEnumerable<SongDto>>(songs);
            return songDtos;
        }
        public async Task<IEnumerable<Song>> GetFullAsync()
        {
            return await _iManager._songRepository.GetFullAsync();
        }
        public async Task<IEnumerable<SongDto>> GetPublicAsync()
        {
            IEnumerable<Song> songs = await _iManager._songRepository.GetPublicAsync();
            IEnumerable<SongDto> songDtos = _mapper.Map<IEnumerable<SongDto>>(songs);
            return songDtos;
        }
        public async Task<IEnumerable<SongDto>> GetByCategoryPublicAsync(string gener)
        {
            IEnumerable<Song> songs = await _iManager._songRepository.GetByCategoryPublicAsync(gener);
            IEnumerable<SongDto> songDtos = _mapper.Map<IEnumerable<SongDto>>(songs);
            return songDtos;
        }

        public async Task<IEnumerable<Song>> GetByUserIdAsync(int userId)
        {
            return await _iManager._songRepository.GetByUserIdAsync(userId);
        }
        public async Task<Song>? GetByIdFullAsync(int id)
        {
            Song song = await _iManager._songRepository.GetByIdFullAsync(id);
            //SongDto songDto = _mapper.Map<SongDto>(song);
            return song;
        }

        public async Task<SongDto>? GetByIdAsync(int id)
        {
            Song song = await _iManager._songRepository.GetByIdAsync(id);
            SongDto songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }

        //public async Task<SongDto> AddAsync(SongDto songDto)
        //{
        //    Song song = _mapper.Map<Song>(songDto);
        //    song.Create_at = DateTime.UtcNow;
        //    song = await _iManager._songRepository.AddAsync(song);
        //    if (song != null)
        //    {
        //        await _iManager.SaveAsync();

        //        songDto = _mapper.Map<SongDto>(song);
        //    }
        //    return songDto;
        //}

        public async Task<SongDto> AddAsync(SongDto songDto)
        {
            // שולחים לשרת Python לקבלת המלל
            using var httpClient = new HttpClient();
            var payload = new { url = songDto.PathSong };
            var response = await httpClient.PostAsJsonAsync("http://localhost:5000/transcribe", payload);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<TranscriptionResult>();
                songDto.Lyrics = result?.corrected_lyrics ?? ""; // שומר רק אם הצליח
            }
            else
            {
                songDto.Lyrics = "לא הצלחנו לתמלל את השיר";
            }

            // ממפה את השיר וממשיך כרגיל
            Song song = _mapper.Map<Song>(songDto);
            song.Create_at = DateTime.UtcNow;
            song = await _iManager._songRepository.AddAsync(song);

            if (song != null)
            {
                await _iManager.SaveAsync();
                songDto = _mapper.Map<SongDto>(song);
            }

            return songDto;
        }

        public async Task<SongDto> UpdateAsync(int id, SongDto songDto)
        {
            Song song = _mapper.Map<Song>(songDto);
            song = await _iManager._songRepository.UpdateAsync(id, song);
            if (song != null)
                await _iManager.SaveAsync();
            songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }
        public async Task<SongDto> UpdatePublicAsync(int id)
        {
            Song song = await _iManager._songRepository.UpdatePublicAsync(id);
            if (song != null)
            {
                await _iManager.SaveAsync();
                // שליחת מיילים למנויים
                var subscribers = await _iManager._userFollowersRepository.GetEmailsOfFollowersAsync(song.UserId);
                var artistName = await _iManager._userRepository.GetUserNameByIdAsync(song.UserId);

                string body = $@"
            <div dir='rtl' style='font-family: ""Segoe UI"", Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #eee; max-width: 600px; margin: auto;'>
                <h2 style='color: #c67c28; margin-bottom: 10px;'>🎵 שיר חדש עלה ל-singsong!</h2>
                <p style='font-size: 18px; color: #333; margin: 0 0 10px 0;'>
                    <strong>{artistName}</strong> העלה שיר חדש בשם <strong>{song.Title}</strong>.
                </p>
                <p style='font-size: 16px; color: #555; margin: 0 0 20px 0;'>
                    נשמח אם תאזינו, תשתפו ותכתבו תגובות ❤
                </p>
                <div style='text-align: center; margin-top: 30px;'>
                    <a href='http://localhost:5173/songComments/{song.Id}'
                       style='background: linear-gradient(90deg, #D59039, #F7C26B); padding: 14px 28px; color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;'>
                        🎧 להזנה לשיר
                    </a>
                </div>
                <hr style='margin-top: 40px; border: none; border-top: 1px solid #eee;' />
                <p style='font-size: 14px; color: #999; text-align: center; margin-top: 10px;'>
                    הודעה זו נשלחה אוטומטית מהאתר singsong
                </p>
            </div>";

                var emailRequest = new EmailRequest
                {
                    To = subscribers,
                    Subject = "New Song Uploaded",
                    Body = body
                };

                await iEmailService.SendEmailAsync(emailRequest);
            }
            SongDto songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }
        public async Task<SongDto> AddPlayAsync(int id)
        {
            Song song = await _iManager._songRepository.AddPlayAsync(id);
            if (song != null)
            {
                await _iManager.SaveAsync();
            }
            SongDto songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var comments = await _iManager._commentRepository.GetBySongIdFullAsync(id);

            if (comments != null)
            {
                foreach (var comment in comments)
                {
                    await _iManager._commentRepository.DeleteAsync(comment.Id);
                }
            }
            var flag =await _iManager._songRepository.DeleteAsync(id);
            if (flag)
                await _iManager.SaveAsync();
            return flag;
        }
        //public List<string> GetGenerTypes()
        //{
        //    return _iManager._songRepository.GetGenerTypes();
        //}
    }
}
