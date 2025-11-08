using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using TimeTable_Backend.Dtos.User;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Mappers
{
    public static class UserMappers
    {
        public static User ToUserLoginRequestDto(this UserLoginRequestDto u)
        {
            return new User
            {
                Email = u.Email,
                Password = u.Password
            };
        }

        public static User ToUserRegisterRequestDto(this UserRegisterRequestDto u)
        {
            return new User
            {
                ID = Guid.NewGuid(),
                Email = u.Email,
                Password = u.Password,
                Firstname = u.Firstname,
                Lastname = u.Lastname
            };
        }
    }
}