using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.DTOs
{
    public class SongDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Gener { get; set; }
        public bool IsPublic { get; set; }
        public string PathSong { get; set; }
        public DateTime Create_at { get; set; }
        public int UserId { get; set; }
    }
}
