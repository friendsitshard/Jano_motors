using JanoMotorsApi.DataContext;
using JanoMotorsApi.DTOs;
using JanoMotorsApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JanoMotorsApi.Services;

namespace JanoMotorsApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserInfosController(MotorsDbContext context, AuthService authService) : ControllerBase
    {
        private readonly MotorsDbContext _context = context;
        private readonly AuthService _authService = authService;

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUserInfos()
        {
            try
            {
                var userInfos = await _context.UserInfos.ToListAsync();

                var result = userInfos.Select(userInfo => new
                {
                    userInfo.Id,
                    userInfo.PhoneNumber,
                    userInfo.Firstname,
                    userInfo.Lastname,
                    userInfo.DateOfBirth,
                    ProfileImage = userInfo.ProfileImage != null
                ? $"data:image/jpeg;base64,{userInfo.ProfileImage}"
                : null 
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching user information.", Error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUserInfo(int id)
        {
            try
            {
                var userInfo = await _context.UserInfos.FindAsync(id);

                if (userInfo == null)
                {
                    return NotFound($"User with ID {id} not found.");
                }

                var result = new
                {
                    userInfo.Id,
                    userInfo.PhoneNumber,
                    userInfo.Firstname,
                    userInfo.Lastname,
                    userInfo.DateOfBirth,
                    ProfileImage = userInfo.ProfileImage != null
                ? $"data:image/jpeg;base64,{userInfo.ProfileImage}"
                : null
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching user information.", Error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateUserInfo(int userId, [FromForm] CreateUserInfoDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                byte[]? byteImages = null;
                if (dto.ProfileImage != null)
                    byteImages = ConvertToByteArray(dto.ProfileImage);

                var userInfo = new UserInfo
                {
                    Id = userId,
                    PhoneNumber = dto.PhoneNumber,
                    Firstname = dto.Firstname,
                    Lastname = dto.Lastname,
                    DateOfBirth = dto.DateOfBirth,
                    ProfileImage = byteImages
                };

                _context.UserInfos.Add(userInfo);

                var userDocs = new List<UserDoc>
                {
                    new UserDoc
                    {
                        UserId = userId,
                        Type = "IDFront",
                        DocImage = ConvertToByteArray(dto.IDFront)
                    },
                    new UserDoc
                    {
                        UserId = userId,
                        Type = "IDBack",
                        DocImage = ConvertToByteArray(dto.IDBack)
                    },
                    new UserDoc
                    {
                        UserId = userId,
                        Type = "LicenseFront",
                        DocImage = ConvertToByteArray(dto.LicenseFront)
                    },
                    new UserDoc
                    {
                        UserId = userId,
                        Type = "LicenseBack",
                        DocImage = ConvertToByteArray(dto.LicenseBack)
                    }
                };

                _context.UserDocs.AddRange(userDocs);

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return NotFound("User not found");
                user.IsVerified = true;

                string role = user.RoleId == 2 ? "admin" : "user";

                await _context.SaveChangesAsync();

                _authService.GenerateJwtToken(userId, role, user.IsVerified);

                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetUserInfo), new { id = userInfo.Id }, userInfo);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] CreateUserInfoDto updateDto)
        {
            try
            {
                var user = await _context.UserInfos.FindAsync(id);

                var userDocs = _context.UserDocs.Where(u => u.UserId == id).ToList();

                if (user == null)
                {
                    return NotFound($"User with ID {id} not found.");
                }

                user.PhoneNumber = updateDto.PhoneNumber;

                user.Firstname = updateDto.Firstname;

                user.Lastname = updateDto.Lastname;

                user.DateOfBirth = updateDto.DateOfBirth;

                if (updateDto.ProfileImage != null)
                {
                    user.ProfileImage = ConvertToByteArray(updateDto.ProfileImage);
                }


                if (updateDto.IDFront != null)
                {
                    userDocs[0].DocImage = ConvertToByteArray(updateDto.IDFront);
                }
                if (updateDto.IDBack != null)
                {
                    userDocs[1].DocImage = ConvertToByteArray(updateDto.IDBack);
                }
                if (updateDto.LicenseFront != null)
                {
                    userDocs[2].DocImage = ConvertToByteArray(updateDto.LicenseFront);
                }
                if (updateDto.LicenseBack != null)
                {
                    userDocs[3].DocImage = ConvertToByteArray(updateDto.LicenseBack);
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _context.SaveChangesAsync();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating user information.", Error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserInfo(int id)
        {
            try
            {
                var userInfo = await _context.UserInfos.FindAsync(id);

                if (userInfo == null)
                    return NotFound("User info not found");

                _context.UserInfos.Remove(userInfo);

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private static byte[] ConvertToByteArray(IFormFile file)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                throw new Exception("Invalid file type. Only JPG, PNG, and GIF are allowed.");
            }
            using var memoryStream = new MemoryStream();
            file.CopyTo(memoryStream);
            return memoryStream.ToArray();
        }
    }
}
