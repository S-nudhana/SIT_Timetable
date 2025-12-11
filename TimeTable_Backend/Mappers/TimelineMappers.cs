using TimeTable_Backend.Dtos.TimelineDto;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Mappers
{
    public static class TimelineMappers
    {
        public static Timeline ToCreateTimelineRequestDto(this Timeline t, int eventID)
        {
            return new Timeline
            {
                Title = t.Title,
                Speaker = t.Speaker,
                Place = t.Place,
                Date = t.Date,
                StartTime = t.StartTime,
                EndTime = t.EndTime,
                EventID = eventID
            };
        }

        public static Timeline ToUpdateTimelineRequestDto (this Timeline t)
        {
            return new Timeline
            {
                ID = t.ID,
                Title = t.Title,
                Speaker = t.Speaker,
                Place = t.Place,
                Date = t.Date,
                StartTime = t.StartTime,
                EndTime = t.EndTime,
                EventID = t.EventID,
            };
        }
    }
}