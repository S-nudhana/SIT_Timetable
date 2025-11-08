using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTable_Backend.models
{
    public class Event
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CoverImagePath { get; set; } = string.Empty;
        public string BannerImagePath { get; set; } = string.Empty;
        public Guid? CreatorUID { get; set; }
        public User? Creator { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}