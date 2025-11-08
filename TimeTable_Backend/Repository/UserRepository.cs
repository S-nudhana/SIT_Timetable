using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public async Task<User?> GetUserByIDAsync(Guid uid)
        {
            return await _dbContext.User.FindAsync(uid);
        }
    }
}