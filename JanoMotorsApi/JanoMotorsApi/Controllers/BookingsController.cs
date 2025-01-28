using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JanoMotorsApi.Models;
using JanoMotorsApi.DataContext;
using Microsoft.Extensions.Options;
using System.Net.Mail;
using System.IO;
using JanoMotorsApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore.Storage;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace JanoMotorsApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController(MotorsDbContext context) : ControllerBase
    {
        private readonly MotorsDbContext _context = context;

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            return Ok(await _context.Bookings.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound("Booking not found.");
            return Ok(booking);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAllUserBookings(int userId)
        {
            var bookings = await _context.Bookings.Where(b => b.UserId == userId).ToListAsync();
            if (bookings == null) return NotFound();
            return Ok(bookings);
        }

        [HttpPost]
        public async Task<IActionResult> RentCar( Booking booking)
        {
            try
            {
                if (booking.StartDate >= booking.EndDate)
                {
                    return BadRequest("StartDate must be earlier than EndDate.");
                }

                var user = await _context.Users.FindAsync(booking.UserId);
                if (user == null || !user.IsVerified)
                {
                    return BadRequest("User is not verified.");
                }

                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    if (!IsCarAvailable(booking.CarId, booking.StartDate, booking.EndDate))
                    {
                        return BadRequest("The requested dates are not available for this car.");
                    }

                    await _context.Bookings.AddAsync(booking);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    //await SendEmailAsync("manager@example.com", "New Reservation Request", $"A new reservation has been made. Booking ID: {booking.Id}");

                    return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while creating the booking.", Error = ex.Message });
            }
        }


        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound("Booking not found.");

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpPost("{id}/upload-invoice")]
        public async Task<IActionResult> UploadInvoice(int id, [FromForm] IFormFile invoiceFile)
        {
            try
            {
                var booking = await _context.Bookings.FindAsync(id);
                if (booking == null) return NotFound("Booking not found.");

                if (invoiceFile == null || invoiceFile.Length == 0)
                    return BadRequest("No file was uploaded.");

                byte[] invoiceBytes;
                using (var memoryStream = new MemoryStream())
                {
                    await invoiceFile.CopyToAsync(memoryStream);
                    invoiceBytes = memoryStream.ToArray();
                }

                var invoiceDoc = new PaymentDoc
                {
                    BookingId = id,
                    Type = "Invoice",
                    DocImage = invoiceBytes
                };

                await _context.PaymentDocs.AddAsync(invoiceDoc);
                await _context.SaveChangesAsync();

                // Notify user
                //var user = await _context.Users.FindAsync(booking.UserId);
                //if (user != null)
                //{
                //    await SendEmailAsync(user.Email, "Invoice Uploaded", $"An invoice has been uploaded for your booking ID: {booking.Id}.");
                //}

                return Ok(new { Message = "Invoice uploaded successfully.", DocId = invoiceDoc.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while uploading the invoice.", Error = ex.Message });
            }
        }

        [HttpPost("{id}/upload-check")]
        public async Task<IActionResult> UploadCheck(int id, [FromForm] IFormFile checkFile)
        {
            try
            {
                var booking = await _context.Bookings.FindAsync(id);
                if (booking == null) return NotFound("Booking not found.");

                if (checkFile == null || checkFile.Length == 0)
                    return BadRequest("No file was uploaded.");

                byte[] checkBytes;
                using (var memoryStream = new MemoryStream())
                {
                    await checkFile.CopyToAsync(memoryStream);
                    checkBytes = memoryStream.ToArray();
                }

                var checkDoc = new PaymentDoc
                {
                    BookingId = id,
                    Type = "Check",
                    DocImage = checkBytes
                };

                await _context.PaymentDocs.AddAsync(checkDoc);
                await _context.SaveChangesAsync();

                // Notify manager
                //await SendEmailAsync("manager@example.com", "Check Uploaded", $"A payment check has been uploaded for booking ID: {booking.Id}.");

                return Ok(new { Message = "Check uploaded successfully.", DocId = checkDoc.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while uploading the check.", Error = ex.Message });
            }
        }

        [HttpGet("{id}/payment-docs")]
        public async Task<IActionResult> GetPaymentDocsByBookingId(int id)
        {
            var paymentDocs = await _context.PaymentDocs.Where(pd => pd.BookingId == id).ToListAsync();
            if (paymentDocs.Count == 0) return NotFound("No payment documents found for this booking.");
            return Ok(paymentDocs.Select(pd => new
            {
                pd.Id,
                pd.Type,
                ImageBase64 = $"data:image/jpeg;base64,{ pd.DocImage}"
            }));
        }

        [HttpPatch("{id}/change-status")]
        public async Task<IActionResult> ChangeBookingStatus(int id, [FromBody] string newStatus)
        {
            try
            {
                var booking = await _context.Bookings.FindAsync(id);
                if (booking == null) return NotFound("Booking not found.");

                booking.Status = newStatus;
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Booking status updated successfully.", Status = newStatus });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating the booking status.", Error = ex.Message });
            }
        }

        // Helper methods
        private bool IsCarAvailable(int carId, DateTime startDate, DateTime endDate)
        {
            return !_context.Bookings
                .Any(b => b.CarId == carId &&
                          b.StartDate < endDate &&
                          b.EndDate > startDate &&
                          (b.Status == "active" ||
                          b.Status == "pending"));
        }

    }
}
