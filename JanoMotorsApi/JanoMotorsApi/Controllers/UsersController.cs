using JanoMotorsApi.DataContext;
using JanoMotorsApi.DTOs;
using JanoMotorsApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JanoMotorsApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(MotorsDbContext context) : ControllerBase
    {
        private readonly MotorsDbContext _context = context;

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                return Ok(await _context.Users.ToListAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(UserRegisterDto userRegister)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Email == userRegister.Email))
                    return BadRequest("User with this email already exists");

                string passwordHash = BCrypt.Net.BCrypt.HashPassword(userRegister.Password);

                var user = new User
                {
                    Email = userRegister.Email,
                    Password = passwordHash
                };

                _context.Users.Add(user);

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserRegisterDto updatedUser)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                    return BadRequest("User not found");

                string passwordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.Password);

                user.Email = updatedUser.Email;
                user.Password = passwordHash;

                await _context.SaveChangesAsync();

                return Ok("User updated");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                    return NotFound();
                return user;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound();
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpGet("verified")]
        public async Task<ActionResult<IEnumerable<UserInfo>>> GetVerifiedUsers()
        {
            try
            {
                var verifiedUsers = await _context.Users
                    .Where(u => u.IsVerified)
                    .ToListAsync();

                if (verifiedUsers.Count == 0)
                {
                    return NotFound("No verified users found.");
                }

                return Ok(verifiedUsers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
