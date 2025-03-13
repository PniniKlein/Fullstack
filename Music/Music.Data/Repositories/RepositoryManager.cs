using Music.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        DataContext _dataContext;
        public ICommentRepository _commentRepository { get; set; }
        public ISongRepository _songRepository { get; set; }
        public IUserRepository _userRepository { get; set; }
        public IUserFollowersRepository _userFollowersRepository { get; set; }
        public RepositoryManager(DataContext dataContext, ICommentRepository commentRepository, ISongRepository songRepository,
                                IUserRepository userRepository,IUserFollowersRepository userFollowersRepository)
        {
            _dataContext = dataContext;
            _commentRepository = commentRepository;
            _songRepository = songRepository;
            _userRepository = userRepository;
            _userFollowersRepository = userFollowersRepository;
        }
        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }
    }
}
