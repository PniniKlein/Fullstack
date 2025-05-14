using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string UserName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public string PathProfile { get; set; }
        public DateTime Create_at { get; set; }= DateTime.UtcNow;
        public List<Song> Songs { get; set; }
        public List<UserFollower> Followers { get; set; }
        public List<UserFollower> Followees { get; set; }
        public List<Role> RoleList { get; set; }

        public User() {
            Create_at = DateTime.UtcNow;
            Songs = new List<Song>();
            RoleList = new List<Role>();

        }

    }
}
