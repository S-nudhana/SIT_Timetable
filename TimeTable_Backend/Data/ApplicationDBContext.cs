using Microsoft.EntityFrameworkCore;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }
        
        public DbSet<User> User { get; set; }
        
        public DbSet<Event> Event { get; set; }
    }
}