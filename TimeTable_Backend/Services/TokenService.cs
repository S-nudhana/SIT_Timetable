using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using TimeTable_Backend.Interfaces;
using TimeTable_Backend.models;

namespace TimeTable_Backend.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _conf;
        private readonly SymmetricSecurityKey _key;
        public TokenService(IConfiguration conf)
        {
            _conf = conf;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_conf["JWT:SigningKey"]));
        }

        public string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("ID", user.ID.ToString())
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
                Issuer = _conf["JWT:Issuer"],
                Audience = _conf["JWT:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}