using TimeTable_Backend.models;

namespace TimeTable_Backend.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIDAsync(Guid uid);
        Task<User?> FindUserByEmailAsync(string email);
        Task<User?> CreateUserAsync(User newUser);
    }
}