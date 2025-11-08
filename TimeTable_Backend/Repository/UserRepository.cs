using Microsoft.EntityFrameworkCore;
using TimeTable_Backend.Data;
using TimeTable_Backend.Interfaces;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public UserRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<User?> CreateUserAsync(User newUser)
        {
            await _dbContext.User.AddAsync(newUser);
            await _dbContext.SaveChangesAsync();
            return newUser;
        }

        public async Task<User?> FindUserByEmailAsync(string email)
        {
            var userData = await _dbContext.User.FirstOrDefaultAsync(u => u.Email == email);
            return userData;
        }

        public async Task<User?> GetUserByIDAsync(Guid uid)
        {
            return await _dbContext.User.FindAsync(uid);
        }
    }
}