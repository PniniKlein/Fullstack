using Microsoft.EntityFrameworkCore;
using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Data
{
    public class DataContext:DbContext
    {
        public DbSet<User> attractions { get; set; }
    }
}
