using TimeTable_Backend.models;

namespace TimeTable_Backend.Interfaces
{
    public interface IEventRepository
    {
        Task<List<Event>> GetAllEventsAsync();
        Task<Event?> GetEventByIDAsync(int id);
        Task<Event> CreateEventAsync(Event newEvent);
        Task<bool> DeleteEventAsync(int id);
    }
}