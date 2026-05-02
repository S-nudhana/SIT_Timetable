using System.Text.Json.Serialization;

namespace TimeTable_Backend.models

{
    public class Event
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public List<Timeline>? Timelines { get; set; } = new List<Timeline>();
        public Guid? CreatorUID { get; set; }
        [JsonIgnore]
        public User? Creator { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}