using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.Entities
{
    public class UserFollower
    {
        public int Id { get; set; }
        public int FollowerId { get; set; }//העוקב
        public User Follower { get; set; }

        public int FolloweeId { get; set; }//על מי עוקבים
        public User Followee { get; set; }
    }
}
