using System.Text.Json.Serialization;

namespace TimeTable_Backend.models
{
    public class Timeline
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int? EventID { get; set; }
        [JsonIgnore]
        public Event? Event { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}