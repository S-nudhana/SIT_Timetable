using TimeTable_Backend.Dtos.EventDto;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Mappers
{
    public static class EventMappers
    {
        public static AdminEventDetailDto ToAdminEventDetailDto(this Event e)
        {
            return new AdminEventDetailDto
            {
                ID = e.ID,
                Title = e.Title,
                Description = e.Description,
                CreatorName = e.Creator != null ? e.Creator.Firstname + " " + e.Creator.Lastname : null,
                StartDate = e.Timelines != null && e.Timelines.Count > 0 ? e.Timelines.Min(t => t.StartTime) : (DateTime?)null,
                EndDate = e.Timelines != null && e.Timelines.Count > 0 ? e.Timelines.Max(t => t.EndTime) : (DateTime?)null,
            };
        }

        public static EventDetailDto ToEventDetailDto(this Event e)
        {
            var now = DateTime.UtcNow;
            var timeline = e.Timelines?
                .OrderBy(t => t.StartTime)
                .FirstOrDefault(t =>
                    (t.StartTime <= now && t.EndTime >= now) ||
                    t.StartTime > now
                );
            return new EventDetailDto
            {
                ID = e.ID,
                Title = e.Title,
                Description = e.Description,
                CreatorName = e.Creator != null ? e.Creator.Firstname + " " + e.Creator.Lastname : null,
                StartDate = e.Timelines != null && e.Timelines.Count > 0 ? e.Timelines.Min(t => t.StartTime) : (DateTime?)null,
                EndDate = e.Timelines != null && e.Timelines.Count > 0 ? e.Timelines.Max(t => t.EndTime) : (DateTime?)null,
                CurrentEvent = timeline == null ? null : new EventTimelineDto
                {
                    ID = timeline.ID,
                    Title = timeline.Title,
                    StartTime = timeline.StartTime,
                    EndTime = timeline.EndTime
                }
            };
        }

        public static Event ToCreateEventRequestDto(this CreateEventRequestDto e, User usr, Guid? uid)
        {
            return new Event
            {
                Title = e.Title,
                Description = e.Description,
                Location = e.Location,
                CreatorUID = uid,
                Creator = usr,
            };
        }
        
        public static AdminEventTimelineDto ToAdminEventTimelineDto(this Event e, List<Timeline> t)
        {
            return new AdminEventTimelineDto
            {
                Event = e.ToAdminEventDetailDto(),
                Timelines = t
            };
        }

        public static Event ToUpdateEventRequestDto(this UpdateEventRequestDto e, User usr, Guid? uid)
        {
            return new Event
            {
                Title = e.Title,
                Description = e.Description,
                Location = e.Location,
                CreatorUID = uid,
                Creator = usr,
            };
        }
    }
}