using Microsoft.EntityFrameworkCore;
using Music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<UserFollower> UserFollowers { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<Comment> Comments { get; set; }
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=music_db");
        //}

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    base.OnConfiguring(optionsBuilder);
        //    //optionsBuilder.LogTo(mesege => Console.Write(mesege));
        //}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // הגדרת המפתח הראשי של UserFollower
            modelBuilder.Entity<UserFollower>()
                .HasKey(uf => uf.Id);

            // כאשר משתמש נמחק, כל מי שעוקב אחריו יימחק אוטומטית
            modelBuilder.Entity<UserFollower>()
                .HasOne(uf => uf.Followee)
                .WithMany(u => u.Followers)
                .HasForeignKey(uf => uf.FolloweeId)
                .OnDelete(DeleteBehavior.Restrict); // מחיקה אוטומטית

            // כאשר משתמש נמחק, הוא מפסיק לעקוב אחרי אחרים - מחיקה ידנית
            modelBuilder.Entity<UserFollower>()
                .HasOne(uf => uf.Follower)
                .WithMany(u => u.Followees)
                .HasForeignKey(uf => uf.FollowerId)
                .OnDelete(DeleteBehavior.Cascade); // מחיקה ידנית בקוד

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict); // מונע מחיקה Cascade של תגובות אם מוחקים משתמש

            modelBuilder.Entity<Comment>()
                .HasOne<Song>() // אין משתנה Song ב- Comment, אז מגדירים רק את הקישור
                .WithMany(s => s.Comments)
                .HasForeignKey(c => c.SongId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
