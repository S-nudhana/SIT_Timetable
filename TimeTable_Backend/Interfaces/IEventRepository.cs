using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Interfaces
{
    public interface IEventRepository
    {
        Task<List<Event>> GetAllEventsAsync();
        Task<Event?> GetEventByIDAsync(int id);
        Task<Event> CreateEventAsync(Event newEvent);
    }
}