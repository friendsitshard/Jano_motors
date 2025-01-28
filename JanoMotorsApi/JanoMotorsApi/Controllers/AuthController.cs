using BCrypt.Net;
using JanoMotorsApi.DataContext;
using JanoMotorsApi.DTOs;
using JanoMotorsApi.Models;
using JanoMotorsApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JanoMotorsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(AuthService authService) : ControllerBase
    {
        private readonly AuthService _authService = authService;
        
        [HttpPost("register")]
        
        public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegister)
        {
            try
            {
                await _authService.RegisterAsync(userRegister);
                return Ok(new { Message = "Registration successful" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("login")]

        public async Task<IActionResult> Login([FromBody] User userLogin)
        {
            try
            {
                var token = await _authService.LoginAsync(userLogin);
                return Ok(new { token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("update-password")]
        public async Task<IActionResult> UpdatePassword(int id, string oldPassword, string newPassword)
        {
            try
            {
                await _authService.UpdatePasswordAsync(id, oldPassword, newPassword);
                return Ok("Password updated");
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
