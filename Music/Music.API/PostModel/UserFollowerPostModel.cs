namespace Music.API.PostModel
{
    public class UserFollowerPostModel
    {
        public int FollowerId { get; set; }//העוקב
        public int FolloweeId { get; set; }//על מי עוקבים
    }
}
