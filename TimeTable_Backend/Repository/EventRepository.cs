using Microsoft.EntityFrameworkCore;

using TimeTable_Backend.Data;
using TimeTable_Backend.Interfaces;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Repository
{
    public class EventRepository : IEventRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public EventRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<int> CreateEventAsync(Event newEvent)
        {
            await _dbContext.Event.AddAsync(newEvent);
            await _dbContext.SaveChangesAsync();
            return newEvent.ID;
        }

        public async Task<bool> DeleteEventAsync(int id)
        {
            var eventData = await _dbContext.Event
                .Include(e => e.Timelines)
                .FirstOrDefaultAsync(e => e.ID == id);
            if (eventData == null)
            {
                return false;
            }
            if (eventData.Timelines != null)
            {
                _dbContext.Timeline.RemoveRange(eventData.Timelines);
            }
            _dbContext.Event.Remove(eventData);

            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<Event>> GetAllEventsAsync()
        {
            var now = DateTime.UtcNow;

            return await _dbContext.Event
                .Include(e => e.Creator)
                .Include(e => e.Timelines)
                .Where(e => e.Timelines != null && e.Timelines.Any(t => t.EndTime >= now))
                .ToListAsync();
        }

        public async Task<Event?> GetEventByIDAsync(int id)
        {
            return await _dbContext.Event.FindAsync(id);
        }

        public async Task<int> UpdateEventAsync(Event updatedEvent, int id)
        {
            var eventData = await _dbContext.Event.FirstOrDefaultAsync(e => e.ID == id);
            if (eventData != null)
            {
                eventData = updatedEvent;
                await _dbContext.SaveChangesAsync();
                return updatedEvent.ID;
            }
            return -1;
        }
    }
}