using JanoMotorsApi.DataContext;
using JanoMotorsApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JanoMotorsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarInfosController(MotorsDbContext context) : ControllerBase
    {
        private readonly MotorsDbContext _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAllCarInfo()
        {
            try
            {
                var carInfos = await _context.CarInfos.ToListAsync();
                return Ok(carInfos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving car info.", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarInfoById(int id)
        {
            try
            {
                var carInfo = await _context.CarInfos.FindAsync(id);

                if (carInfo == null)
                {
                    return NotFound($"Car info with ID {id} not found.");
                }

                var bookings = await _context.Bookings
                    .Where(r => r.CarId == id)
                    .ToListAsync();

                var rentDates = bookings
                    .Where(r => r.Status != "finished" && r.Status != "cancelled")
                    .SelectMany(r => Enumerable.Range(0, (r.EndDate - r.StartDate).Days + 1)
                    .Select(offset => r.StartDate.AddDays(offset)))
                    .ToList();

                var result = new
                {
                    carInfo,
                    rentDates
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving car info.", error = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CreateCarInfo([FromBody] CarInfo carInfo)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _context.CarInfos.Add(carInfo);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCarInfoById), new { id = carInfo.Id }, carInfo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating car info.", error = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCarInfo(int id, [FromBody] CarInfo updatedCarInfo)
        {
            try
            {
                if (id != updatedCarInfo.Id)
                {
                    return BadRequest("CarInfo ID mismatch.");
                }

                var carInfo = await _context.CarInfos.FindAsync(id);
                if (carInfo == null)
                {
                    return NotFound($"Car info with ID {id} not found.");
                }

                carInfo.HorsePower = updatedCarInfo.HorsePower;
                carInfo.EngineType = updatedCarInfo.EngineType;
                carInfo.DriverPrice = updatedCarInfo.DriverPrice;
                carInfo.AirportPrice = updatedCarInfo.AirportPrice;

                _context.CarInfos.Update(carInfo);
                await _context.SaveChangesAsync();

                return Ok(carInfo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating car info.", error = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCarInfo(int id)
        {
            try
            {
                var carInfo = await _context.CarInfos.FindAsync(id);
                if (carInfo == null)
                {
                    return NotFound($"Car info with ID {id} not found.");
                }

                _context.CarInfos.Remove(carInfo);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Car info deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting car info.", error = ex.Message });
            }
        }
    }
}

