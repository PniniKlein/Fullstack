using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.DTOs
{
    public class UserFollowerDto
    {
        public int Id { get; set; }
        public int FollowerId { get; set; }//העוקב
        public int FolloweeId { get; set; }//על מי עוקבים
    }
}
