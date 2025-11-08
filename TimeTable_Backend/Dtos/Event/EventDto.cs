using System.ComponentModel.DataAnnotations;

namespace TimeTable_Backend.Dtos.Event
{
    public class EventDetailDto
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CoverImagePath { get; set; } = string.Empty;
        public string BannerImagePath { get; set; } = string.Empty;
    }

    public class CreateEventRequestDto
    {
        [Required(ErrorMessage = "กรุณาใส่ชื่อกิจกรรม")]
        public string Title { get; set; } = string.Empty;
        public string CoverImagePath { get; set; } = string.Empty;
        public string BannerImagePath { get; set; } = string.Empty;
        public Guid? CreatorUID { get; set; }
    }
}