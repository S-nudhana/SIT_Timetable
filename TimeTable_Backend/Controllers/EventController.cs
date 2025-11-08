using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using TimeTable_Backend.Repository;
using TimeTable_Backend.Data;
using TimeTable_Backend.Models.Responses;
using TimeTable_Backend.Mappers;
using TimeTable_Backend.Dtos.Event;
using TimeTable_Backend.Interfaces;

namespace TimeTable_Backend.Controllers
{
    [Route("api/event")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly IEventRepository _EventRepository;
        private readonly IUserRepository _UserRepository;
        public EventController(IEventRepository eventRepository, IUserRepository userRepository)
        {
            _EventRepository = eventRepository;
            _UserRepository = userRepository;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEventByID([FromRoute] int id)
        {
            try
            {
                var eventData = await _EventRepository.GetEventByIDAsync(id);
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
                    Data = eventData.ToEventDetailDto()
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

        [HttpPost("{uid}")]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequestDto req, [FromRoute] Guid uid)
        {
            try
            {
                var user = await _UserRepository.GetUserByIDAsync(uid);
                if (user == null)
                    return BadRequest("User not found");

                var newEvent = req.ToCreateEventRequestDto(user, uid);
                await _EventRepository.CreateEventAsync(newEvent);
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
    }
}