using System.ComponentModel.DataAnnotations;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Dtos.EventDto
{
    public class EventDetailDto
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CoverImagePath { get; set; } = string.Empty;
        public string BannerImagePath { get; set; } = string.Empty;
    }

    public class EventTimelineDto
    {
        public EventDetailDto? Event { get; set; }
        public List<Timeline>? Timelines { get; set; }
    }

    public class CreateEventRequestDto
    {
        [Required(ErrorMessage = "กรุณาใส่ชื่อกิจกรรม")]
        public string Title { get; set; } = string.Empty;
        public string CoverImagePath { get; set; } = string.Empty;
        public string BannerImagePath { get; set; } = string.Empty;

        [Required(ErrorMessage = "ไม่มีรหัสผู้สร้างกิจกรรม")]
        public Guid? CreatorUID { get; set; }
        public Timeline[]? Timelines { get; set; }
    }

    public class UpdateEventRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string CoverImagePath { get; set; } = string.Empty;
        public string BannerImagePath { get; set; } = string.Empty;
        public Guid? CreatorUID { get; set; }
        public Timeline[]? Timelines { get; set; }
    }
}