using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using TimeTable_Backend.Models.Responses;
using TimeTable_Backend.Mappers;
using TimeTable_Backend.Interfaces;
using TimeTable_Backend.Dtos.EventDto;

namespace TimeTable_Backend.Controllers
{
    [Route("api/event")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly IEventRepository _EventRepository;
        private readonly IUserRepository _UserRepository;
        private readonly ITimelineRepository _TimelineRepository;
        public EventController(IEventRepository eventRepository, IUserRepository userRepository, ITimelineRepository timelineRepository)
        {
            _EventRepository = eventRepository;
            _UserRepository = userRepository;
            _TimelineRepository = timelineRepository;
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetEventByID([FromRoute] int id)
        {
            try
            {
                var eventData = await _EventRepository.GetEventByIDAsync(id);
                var timelineData = await _TimelineRepository.GetAllTimelinesByIDAsync(id);
                if (eventData == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "ไม่พบกิจกรรมที่ร้องขอ",
                        Data = null
                    });
                }
                EventTimelineDto result = eventData.ToEventTimelineDto(timelineData);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "โหลดกิจกรรมสำเร็จ",
                    Data = result
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "เกิดข้อผิดพลาดในการโหลดกิจกรรม",
                    Data = null
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetEvents()
        {
            try
            {
                var eventData = (await _EventRepository.GetAllEventsAsync()).Select(e => e.ToEventDetailDto());
                if (eventData == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "ไม่พบกิจกรรมที่ร้องขอ",
                        Data = null
                    });
                }
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "โหลดกิจกรรมสำเร็จ",
                    Data = eventData
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "เกิดข้อผิดพลาดในการโหลดกิจกรรม",
                    Data = null
                });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequestDto req)
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "ID");
                if (userIdClaim == null)
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "ไม่พบข้อมูลผู้ใช้",
                        Data = null
                    });
                Guid uid = Guid.Parse(userIdClaim.Value);
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)),
                        Data = null
                    });
                }
                var user = await _UserRepository.GetUserByIDAsync(uid);
                if (user == null)
                    return BadRequest("ไม่พบผู้ใช้");

                var newEvent = req.ToCreateEventRequestDto(user, uid);
                var eventID = await _EventRepository.CreateEventAsync(newEvent);
                if (req.Timelines != null)
                {
                    foreach (var timelineReq in req.Timelines)
                    {
                        var timeline = timelineReq.ToCreateTimelineRequestDto(eventID);
                        await _TimelineRepository.CreateTimelineAsync(timeline);
                    }
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "สร้างกิจกรรมสำเร็จ",
                    Data = null
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "ไม่สามารถสร้างกิจกรรมได้",
                    Data = null
                });
            }
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteEvent([FromRoute] int id)
        {
            try
            {
                var eventDeleteStatus = await _EventRepository.DeleteEventAsync(id);

                if (!eventDeleteStatus)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "ไม่พบกิจกรรมที่ต้องการลบ",
                        Data = null
                    });
                }

                await _TimelineRepository.DeleteTimelineAsync(id);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "ลบกิจกรรมสำเร็จ",
                    Data = null
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "ไม่สามารถลบกิจกรรมได้",
                    Data = null
                });
            }
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateEvent([FromRoute] int id, [FromBody] UpdateEventRequestDto req)
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "ID");
                if (userIdClaim == null)
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "ไม่พบข้อมูลผู้ใช้",
                        Data = null
                    });
                Guid uid = Guid.Parse(userIdClaim.Value);
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)),
                        Data = null
                    });
                }
                var user = await _UserRepository.GetUserByIDAsync(uid);
                if (user == null)
                    return BadRequest("ไม่พบผู้ใช้");

                var existingEvent = await _EventRepository.GetEventByIDAsync(id);
                if (existingEvent == null)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "ไม่พบอีเวนท์ที่ต้องการแก้ไข",
                        Data = null
                    });
                }

                var editedEvent = req.ToUpdateEventRequestDto(user, uid);
                var eventID = await _EventRepository.UpdateEventAsync(editedEvent, id);
                if (eventID == -1)
                {
                    return StatusCode(500, new ApiResponse<object>
                    {
                        Success = false,
                        Message = "แก้ไขข้อมูลอีเวนท์ผิดพลาด",
                        Data = null
                    });
                }
                if (req.Timelines == null)
                {
                    return StatusCode(500, new ApiResponse<object>
                    {
                        Success = false,
                        Message = "แก้ไขข้อมูลตารางเวลาผิดพลาด",
                        Data = null
                    });       
                }
                var timeline = req.Timelines.Select(t => t.ToUpdateTimelineRequestDto()).ToList();
                bool result = await _TimelineRepository.UpdateTimelineAsync(timeline);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "แก้ไขกิจกรรมเรียบร้อย",
                    Data = null
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "ไม่สามารถอัปเดตกิจกรรมได้",
                    Data = null
                });
            }
        }
    }
}