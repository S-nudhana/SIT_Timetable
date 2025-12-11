using Microsoft.EntityFrameworkCore;
using TimeTable_Backend.Data;
using TimeTable_Backend.Interfaces;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Repository
{
    public class TimelineRepository : ITimelineRepository
    {
        private readonly ApplicationDBContext _dbContext;
        public TimelineRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Timeline>> GetAllTimelinesByIDAsync(int id)
        {
            List<Timeline> timelineData = await _dbContext.Timeline.Where(e => e.EventID == id).ToListAsync();
            return timelineData;
        }

        public async Task<Timeline> CreateTimelineAsync(Timeline newTimeline)
        {
            await _dbContext.Timeline.AddAsync(newTimeline);
            await _dbContext.SaveChangesAsync();
            return newTimeline;
        }

        public async Task<bool> UpdateTimelineAsync(List<Timeline> updatedTimeline)
        {
            foreach (var timeline in updatedTimeline)
            {
                var existingTimeline = await _dbContext.Set<Timeline>().FindAsync(timeline.ID);
                if (existingTimeline == null)
                {
                    throw new Exception("Timeline not found");
                }
                
                existingTimeline.Title = timeline.Title;
                existingTimeline.Speaker = timeline.Speaker;
                existingTimeline.Place = timeline.Place;
                existingTimeline.Date = timeline.Date;
                existingTimeline.StartTime = timeline.StartTime;
                existingTimeline.EndTime = timeline.EndTime;
                existingTimeline.EventID = timeline.EventID;
                existingTimeline.UpdatedAt = DateTime.Now;

                _dbContext.Set<Timeline>().Update(existingTimeline);
                await _dbContext.SaveChangesAsync();
            }
            return true;
        }

        public async Task<bool> DeleteTimelineAsync(int id)
        {
            var timelineData = await _dbContext.Timeline.FirstOrDefaultAsync(e => e.EventID == id);
            if (timelineData == null)
            {
                return false;
            }
            _dbContext.ExecuteSqlRaw($"DELETE FROM Timetable WHERE EventID IN ({id})");
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}