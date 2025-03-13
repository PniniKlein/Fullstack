using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Core.IRepositories
{
    public interface IRepositoryManager
    {
        ICommentRepository _commentRepository { get; set; }
        ISongRepository _songRepository { get; set; }
        IUserRepository _userRepository { get; set; }
        IUserFollowersRepository _userFollowersRepository { get; set; }

        Task SaveAsync();
    }
}
