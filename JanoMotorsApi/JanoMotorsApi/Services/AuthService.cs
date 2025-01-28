using JanoMotorsApi.DataContext;
using JanoMotorsApi.DTOs;
using JanoMotorsApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JanoMotorsApi.Services
{
    public class AuthService(IOptions<JwtSettings> jwtSettings, MotorsDbContext context)
    {
        private readonly JwtSettings _jwtSettings = jwtSettings.Value;
        private readonly MotorsDbContext _context = context;

        public async Task RegisterAsync(UserRegisterDto userRegister)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userRegister.Email))
                throw new Exception("User with this email already exists");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userRegister.Password);

            var user = new User
            {
                Email = userRegister.Email,
                Password = passwordHash
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();
        }

        public async Task<string> LoginAsync(User userLogin)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userLogin.Email) 
                ?? throw new UnauthorizedAccessException("Invalid email");

            if (!BCrypt.Net.BCrypt.Verify(userLogin.Password, user.Password))
                throw new UnauthorizedAccessException("Invalid password");

            string role = user.RoleId == 2 ? "admin" : "user";

            return GenerateJwtToken(user.Id, role, user.IsVerified);
        }

        public async Task UpdatePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId)
                ?? throw new KeyNotFoundException("User not found");

            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.Password))
                throw new UnauthorizedAccessException("Current password is incorrect");

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);

            await _context.SaveChangesAsync();
        }

        public string GenerateJwtToken(int userId, string role, bool isVerified)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = _jwtSettings.Audience,
                Issuer = _jwtSettings.Issuer,
                Subject = new ClaimsIdentity([
                    new Claim("id", Convert.ToString(userId)),
                    new Claim(ClaimTypes.Role, role),
                    new Claim("isVerified", Convert.ToString(isVerified))
                ]),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
