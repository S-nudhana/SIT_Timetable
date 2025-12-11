using Microsoft.AspNetCore.Mvc;
using TimeTable_Backend.Models.Responses;

namespace TimeTable_Backend.Controllers
{
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> TestAPI()
        {
            try
            {
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "API ทำงานได้ปกติ",
                    Data = null
                });
            }
            catch
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "เกิดข้อผิดพลาดในการเชื่อมต่อ",
                    Data = null
                });
            }
        }
    }
}