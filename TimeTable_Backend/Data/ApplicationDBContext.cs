using Microsoft.EntityFrameworkCore;
using TimeTable_Backend.models;
using TimeTable_Backend.Models;

namespace TimeTable_Backend.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }
        
        public DbSet<User> User { get; set; }
        
        public DbSet<Event> Event { get; set; }

        public DbSet<Timeline> Timeline { get; set; }

        internal void ExecuteSqlRaw(string v)
        {
            throw new NotImplementedException();
        }
    }
}