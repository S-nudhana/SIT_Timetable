using TimeTable_Backend.models;

namespace TimeTable_Backend.Interfaces
{
    public interface IEventRepository
    {
        Task<List<Event>> GetAllEventsAsync();
        Task<Event?> GetEventByIDAsync(int id);
        Task<int> CreateEventAsync(Event newEvent);
        Task<bool> DeleteEventAsync(int id);
        Task<int> UpdateEventAsync(Event updatedEvent, int id);
    }
}