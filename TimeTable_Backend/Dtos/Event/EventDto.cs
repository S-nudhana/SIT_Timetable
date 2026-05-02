using System.ComponentModel.DataAnnotations;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Dtos.EventDto
{
    public class AdminEventDetailDto
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? CreatorName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class AdminEventTimelineDto
    {
        public AdminEventDetailDto? Event { get; set; }
        public List<Timeline>? Timelines { get; set; }
    }

    public class EventDetailDto
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? CreatorName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public EventTimelineDto? CurrentEvent { get; set; }
    }

    public class EventTimelineDto
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

    public class CreateEventRequestDto
    {
        [Required(ErrorMessage = "กรุณาใส่ชื่อกิจกรรม")]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public Timeline[]? Timelines { get; set; }
    }

    public class UpdateEventRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public Guid? CreatorUID { get; set; }
        public Timeline[]? Timelines { get; set; }
    }
}