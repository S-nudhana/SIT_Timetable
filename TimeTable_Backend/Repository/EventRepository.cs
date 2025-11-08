using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public async Task<Event> CreateEventAsync(Event newEvent)
        {
            await _dbContext.Event.AddAsync(newEvent);
            await _dbContext.SaveChangesAsync();
            return newEvent;
        }

        public async Task<bool> DeleteEventAsync(int id)
        {
            var eventData = await _dbContext.Event.FirstOrDefaultAsync(e => e.ID == id);
            if (eventData == null)
            {
                return false;
            }
            _dbContext.Event.Remove(eventData);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<Event>> GetAllEventsAsync()
        {
            return await _dbContext.Event.ToListAsync();
        }

        public async Task<Event?> GetEventByIDAsync(int id)
        {
            return await _dbContext.Event.FindAsync(id);
        }
    }
}