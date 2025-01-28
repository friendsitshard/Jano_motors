using JanoMotorsApi.DataContext;
using JanoMotorsApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JanoMotorsApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserDocsController(MotorsDbContext context) : ControllerBase
    {
        private readonly MotorsDbContext _context = context;

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAllDocsByUserId(int userId)
        {
            try
            {
                var userDocs = await _context.UserDocs
                .Where(doc => doc.UserId == userId)
                .ToListAsync();

                if (userDocs.Count == 0)
                {
                    return NotFound("No documents found for this user.");
                }

                var result = userDocs.Select(doc => new
                {
                    doc.Id,
                    doc.Type,
                    ImageBase64 = $"data:image/jpeg;base64,{doc.DocImage}"
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserDocById(int id)
        {
            try
            {
                var userDoc = await _context.UserDocs.FindAsync(id);

                if (userDoc == null)
                    return NotFound("Can't find this document");

                var base64String = Convert.ToBase64String(userDoc.DocImage);

                var imageDataUrl = $"data:image/jpeg;base64,{base64String}";

                return Ok(new { imageDataUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadUserDoc(int userId, string type, [FromForm] IFormFile docImage)
        {
            try
            {
                if (docImage == null || docImage.Length == 0)
                {
                    return BadRequest("No file was uploaded.");
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".pdf" };
                var fileExtension = Path.GetExtension(docImage.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Invalid file type. Only JPG, PNG, GIF, and PDF are allowed.");
                }

                using var memoryStream = new MemoryStream();
                await docImage.CopyToAsync(memoryStream);
                byte[] imageBytes = memoryStream.ToArray();

                var userDoc = new UserDoc
                {
                    UserId = userId,
                    Type = type,
                    DocImage = imageBytes
                };

                _context.UserDocs.Add(userDoc);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUserDocById), new { id = userDoc.Id }, new { message = "Document uploaded successfully", userDoc.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserDoc(int id)
        {
            try
            {
                var userDoc = await _context.UserDocs.FindAsync(id);
                if (userDoc == null)
                {
                    return NotFound("Document not found.");
                }

                _context.UserDocs.Remove(userDoc);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Document deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
