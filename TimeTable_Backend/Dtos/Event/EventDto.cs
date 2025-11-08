using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTable_Backend.Dtos.Event
{
    public class EventDetailDto
    {
        public int ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CoverImagePath { get; set; } = string.Empty;
        public string BannerImagePath { get; set; } = string.Empty;
        public Guid? CreatorUID { get; set; }
    }

    public class CreateEventRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string CoverImagePath { get; set; } = string.Empty;
        public string BannerImagePath { get; set; } = string.Empty;
        public Guid? CreatorUID { get; set; }
    }
}