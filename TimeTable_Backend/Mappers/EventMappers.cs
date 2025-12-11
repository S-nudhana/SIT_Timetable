using TimeTable_Backend.Dtos.EventDto;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Mappers
{
    public static class EventMappers
    {
        public static EventDetailDto ToEventDetailDto(this Event e)
        {
            return new EventDetailDto
            {
                ID = e.ID,
                Title = e.Title,
                CoverImagePath = e.CoverImagePath,
                BannerImagePath = e.BannerImagePath,
            };
        }

        public static Event ToCreateEventRequestDto(this CreateEventRequestDto e, User usr, Guid? uid)
        {
            return new Event
            {
                Title = e.Title,
                CoverImagePath = e.CoverImagePath,
                BannerImagePath = e.BannerImagePath,
                CreatorUID = uid,
                Creator = usr,
            };
        }

        public static EventTimelineDto ToEventTimelineDto(this Event e, List<Timeline> t)
        {
            return new EventTimelineDto
            {
                Event = e.ToEventDetailDto(),
                Timelines = t,
            };
        }

        public static Event ToUpdateEventRequestDto(this UpdateEventRequestDto e, User usr, Guid? uid)
        {
            return new Event
            {
                Title = e.Title,
                CoverImagePath = e.CoverImagePath,
                BannerImagePath = e.BannerImagePath,
                CreatorUID = uid,
                Creator = usr,
            };
        }
    }
}