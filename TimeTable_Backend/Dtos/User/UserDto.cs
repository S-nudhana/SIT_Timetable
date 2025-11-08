using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TimeTable_Backend.Dtos.User
{
    public class UserLoginRequestDto
    {
        [Required(ErrorMessage = "กรุณาใส่อีเมล")]
        [EmailAddress(ErrorMessage = "รูปแบบอีเมลไม่ถูกต้อง")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6, ErrorMessage = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร")]
        public string Password { get; set; } = string.Empty;
    }

    public class UserRegisterRequestDto
    {
        [Required(ErrorMessage = "กรุณาใส่อีเมล")]
        [EmailAddress(ErrorMessage = "รูปแบบอีเมลไม่ถูกต้อง")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6, ErrorMessage = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "กรุณาใส่ชื่อ")]
        public string Firstname { get; set; } = string.Empty;

        [Required(ErrorMessage = "กรุณาใส่นามสกุล")]
        public string Lastname { get; set; } = string.Empty;
    }
}