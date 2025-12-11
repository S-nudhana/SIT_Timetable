using TimeTable_Backend.Dtos.TimelineDto;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Interfaces
{
    public interface ITimelineRepository
    {
        Task<List<Timeline>> GetAllTimelinesByIDAsync(int id);
        Task<Timeline> CreateTimelineAsync(Timeline newTimeline);
        Task<bool> UpdateTimelineAsync(List<Timeline> updatedTimeline);
        Task<bool> DeleteTimelineAsync(int id);
    }
}