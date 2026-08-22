using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Dayflow.Backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace Dayflow.Backend.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User user)
        {
            var secretKey = _configuration["Jwt:SecretKey"] ?? "DayflowSuperSecretKeyForHackathon2026WithHighEntropy123!";
            var issuer = _configuration["Jwt:Issuer"] ?? "DayflowHRMS";
            var audience = _configuration["Jwt:Audience"] ?? "DayflowUsers";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("EmployeeId", user.EmployeeId),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
