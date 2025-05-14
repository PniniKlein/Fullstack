namespace Music.API.PostModel
{
    public class CommentPostModel
    {
        public string Content { get; set; }
        public int Star { get; set; }
        public int SongId { get; set; }
        public int UserId { get; set; }
    }
}
