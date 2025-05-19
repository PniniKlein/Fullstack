using Music.Core.Entities;

namespace Music.API.PostModel
{
    public class SongPostModel
    {
        public string Title { get; set; }
        public string Gener { get; set; }
        public string Lyrics { get; set; }
        public bool IsPublic { get; set; }
        public string PathSong { get; set; }
        public string PathPicture { get; set; }
        public int Plays { get; set; }
        public int UserId { get; set; }
    }
}
