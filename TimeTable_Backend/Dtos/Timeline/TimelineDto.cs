using TimeTable_Backend.models;

namespace TimeTable_Backend.Dtos.TimelineDto
{
    public class UpdateTimelineRequestDto
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Speaker { get; set; } = string.Empty;
        public string Place { get; set; } = string.Empty;
        public DateOnly Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int? EventID { get; set; }
        public Event? Event { get; set; }
    }
}