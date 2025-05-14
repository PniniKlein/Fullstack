using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.Entities
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        public int SongId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string Content { get; set; }
        public int Star { get; set; }
        public DateTime Create_at { get; set; } = DateTime.UtcNow;

        Comment()
        {
            Create_at = DateTime.UtcNow;
        }
    }
}
