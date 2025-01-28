using JanoMotorsApi.DataContext;
using JanoMotorsApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JanoMotorsApi.Controllers
{
    [Authorize(Roles = "admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class CarDocsController(MotorsDbContext context) : ControllerBase
    {
        private readonly MotorsDbContext _context = context;

        [AllowAnonymous]
        [HttpGet("car/{carId}")]
        public async Task<IActionResult> GetDocsByCarId(int carId)
        {
            var carDocs = await _context.CarDocs
                .Where(doc => doc.CarId == carId)
                .ToListAsync();

            if (carDocs == null || carDocs.Count == 0)
            {
                return NotFound($"No documents found for car with ID {carId}.");
            }

            var result = carDocs.Select(doc => new
            {
                doc.Id,
                doc.CarId,
                Base64Image = $"data:image/jpeg;base64,{doc.DocImage}"
            });

            return Ok(result);
        }

        [HttpPost("{carId}/bulk-upload")]
        public async Task<IActionResult> BulkUploadDocs(int carId, [FromForm] List<IFormFile> docImages)
        {
            if (docImages == null || docImages.Count == 0)
            {
                return BadRequest("No files were uploaded.");
            }

            try
            {
                var car = await _context.Cars.FindAsync(carId);
                if (car == null)
                {
                    return NotFound($"Car with ID {carId} not found.");
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
                var carDocs = new List<CarDoc>();

                foreach (var docImage in docImages)
                {
                    var fileExtension = Path.GetExtension(docImage.FileName).ToLower();

                    if (!allowedExtensions.Contains(fileExtension))
                    {
                        return BadRequest($"Invalid file type for {docImage.FileName}. Only JPG, PNG, and PDF are allowed.");
                    }

                    using var memoryStream = new MemoryStream();
                    await docImage.CopyToAsync(memoryStream);
                    var imageBytes = memoryStream.ToArray();

                    carDocs.Add(new CarDoc
                    {
                        CarId = carId,
                        DocImage = imageBytes
                    });
                }

                await _context.CarDocs.AddRangeAsync(carDocs);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Documents uploaded successfully.", carDocs = carDocs.Select(d => d.Id) });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while uploading documents.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoc(int id)
        {
            var carDoc = await _context.CarDocs.FindAsync(id);

            if (carDoc == null)
            {
                return NotFound($"Document with ID {id} not found.");
            }

            try
            {
                _context.CarDocs.Remove(carDoc);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Document deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the document.", error = ex.Message });
            }
        }
    }
}

