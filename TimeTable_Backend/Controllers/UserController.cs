using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

using TimeTable_Backend.Dtos.User;
using TimeTable_Backend.Models.Responses;
using TimeTable_Backend.Mappers;
using TimeTable_Backend.models;
using TimeTable_Backend.Interfaces;
using System.Runtime.InteropServices;

namespace TimeTable_Backend.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _UserRepository;
        private readonly bool _isProduction;
        private readonly ITokenService _tokenService;
        public UserController(IConfiguration conf, ITokenService tokenService, IUserRepository userRepository)
        {
            _UserRepository = userRepository;
            _isProduction = conf.GetValue<bool>("AppSettings:Production");
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> UserRegister([FromBody] UserRegisterRequestDto req)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)),
                        Data = null
                    });
                }
                var newUser = req.ToUserRegisterRequestDto();
                var existingUser = await _UserRepository.FindUserByEmailAsync(newUser.Email);
                if (existingUser != null)
                {
                    return Conflict(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "อีเมลนี้ถูกใช้งานแล้ว",
                        Data = null
                    });
                }
                var passwordHasher = new PasswordHasher<User>();
                newUser.Password = passwordHasher.HashPassword(newUser, newUser.Password);
                await _UserRepository.CreateUserAsync(newUser);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "สร้างผู้ใช้สำเร็จ",
                    Data = null
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "ไม่สามารถสร้างผู้ใช้ได้",
                    Data = null
                });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> UserLogin([FromBody] UserLoginRequestDto req)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        Message = string.Join(" และ ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)),
                        Data = null
                    });
                }
                var userRequest = req.ToUserLoginRequestDto();
                var existingUser = await _UserRepository.FindUserByEmailAsync(userRequest.Email);
                if (existingUser == null)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
                        Data = null
                    });
                }
                var hasher = new PasswordHasher<User>();
                var result = hasher.VerifyHashedPassword(existingUser, existingUser.Password, req.Password);
                if (result == PasswordVerificationResult.Failed)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
                        Data = null
                    });
                }
                var token = _tokenService.CreateToken(existingUser);
                Response.Cookies.Append("Token", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = _isProduction,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "เข้าสู่ระบบสำเร็จ",
                    Data = null
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "ไม่สามารถเข้าสู่ระบบได้",
                    Data = null
                });
            }
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> RemoveUser()
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "ID");
                if (userIdClaim == null)
                {
                    return Unauthorized(new ApiResponse<Object>
                    {
                        Success = false,
                        Message = "ไม่พบข้อมูลผู้ใช้",
                        Data = null
                    });
                }
                Guid uid = Guid.Parse(userIdClaim.Value);
                var user = await _UserRepository.GetUserByIDAsync(uid);
                if (user == null)
                    return BadRequest("ไม่พบผู้ใช้");

                var deleteEventStatus = await _UserRepository.DeleteUserAsync(uid);
                if (!deleteEventStatus)
                {
                    return StatusCode(500, new ApiResponse<object>
                    {
                        Success = false,
                        Message = "ลบบัญชีผิดพลาด",
                        Data = null
                    });
                }
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "ลบบัญชีสำเร็จ",
                    Data = null
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "ไม่สามารถลบบัญชีได้",
                    Data = null
                });
            }
        }
        [HttpGet("authorize")]
        public async Task<IActionResult> Authorize()
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "ID");
                if (userIdClaim == null)
                {
                    return Unauthorized(new ApiResponse<Object>
                    {
                        Success = false,
                        Message = "ไม่พบข้อมูลผู้ใช้",
                        Data = null
                    });
                }
                Guid uid = Guid.Parse(userIdClaim.Value);
                var user = await _UserRepository.GetUserByIDAsync(uid);
                if (user == null)
                    return BadRequest("ไม่พบผู้ใช้");

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "อนุญาตให้เข้าถึงได้",
                    Data = new
                    {
                        Authorized = true,
                        UserFirstname = user.Firstname
                    }
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "ไม่สามารถตรวจสอบสิทธิ์ได้",
                    Data = null
                });
            }
        }
        [HttpGet("logout")]
        public IActionResult Logout()
        {
            try
            {
                Response.Cookies.Delete("Token");
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "ออกจากระบบสำเร็จ",
                    Data = null
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "ไม่สามารถออกจากระบบได้",
                    Data = null
                });
            }
        }
    }
}