using TimeTable_Backend.models;

namespace TimeTable_Backend.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user);
        // bool DecodeToken(string token);
    }
}