using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

using TimeTable_Backend.Dtos.User;
using TimeTable_Backend.Data;
using TimeTable_Backend.Models.Responses;
using TimeTable_Backend.Mappers;
using TimeTable_Backend.models;
using Microsoft.EntityFrameworkCore;

namespace TimeTable_Backend.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDBContext _dbContext;
        public UserController(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> UserRegister([FromBody] UserRegisterRequestDto req)
        {
            try
            {
                var newUser = req.ToUserRegisterRequestDto();
                var passwordHasher = new PasswordHasher<User>();
                newUser.Password = passwordHasher.HashPassword(newUser, newUser.Password);
                await _dbContext.User.AddAsync(newUser);
                await _dbContext.SaveChangesAsync();
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
                var userRequest = req.ToUserLoginRequestDto();
                var existingUser = await _dbContext.User.FirstOrDefaultAsync(u => u.Email == userRequest.Email);
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
                var result = hasher.VerifyHashedPassword(userRequest, existingUser.Password, userRequest.Password);
                if (result == PasswordVerificationResult.Failed)
                {
                    return Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
                        Data = null
                    });
                }

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
    }
}