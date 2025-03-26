using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.Entities
{
    public class Song
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime Create_at { get; set; } = DateTime.UtcNow;
        public string Gener { get; set; }
        public bool IsPublic { get; set; }
        public string PathSong { get; set; }
        public int UserId { get; set; }
        public List<Comment> Comments { get; set; }

        public Song()
        {
            Create_at = DateTime.UtcNow;
            Comments = new List<Comment>();
        }
    }
}
