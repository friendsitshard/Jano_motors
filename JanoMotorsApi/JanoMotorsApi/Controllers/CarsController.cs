using JanoMotorsApi.DataContext;
using JanoMotorsApi.DTOs;
using JanoMotorsApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Text.RegularExpressions;

namespace JanoMotorsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController(MotorsDbContext context) : ControllerBase
    {
        private readonly MotorsDbContext _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAllCars()
        {
            try
            {
                var cars = await _context.Cars.ToListAsync();
                return Ok(cars);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching cars.", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarById(int id)
        {
            try
            {
                var car = await _context.Cars.FindAsync(id);
                if (car == null)
                    return NotFound("Car not found.");

                return Ok(car);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching the car.", error = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CreateCar(CarCreateDto createCar)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                byte[]? imageBytes = null;

                if (createCar.MainImage != null)
                {
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                    var fileExtension = Path.GetExtension(createCar.MainImage.FileName).ToLower();

                    if (!allowedExtensions.Contains(fileExtension))
                    {
                        return BadRequest("Invalid file type. Only JPG, PNG, and GIF are allowed.");
                    }

                    using var memoryStream = new MemoryStream();
                    await createCar.MainImage.CopyToAsync(memoryStream);
                    imageBytes = memoryStream.ToArray();
                }

                var car = new Car
                {
                    Make = createCar.Make,
                    Model = createCar.Model,
                    Year = createCar.Year,
                    Transmission = createCar.Transmission,
                    Passengers = createCar.Passengers,
                    DailyPrice = createCar.DailyPrice,
                    MainImage = imageBytes
                };

                _context.Cars.Add(car);
                await _context.SaveChangesAsync();

                var carInfo = new CarInfo
                {
                    Id = car.Id,
                    EngineType = createCar.EngineType,
                    HorsePower = createCar.HorsePower,
                    AirportPrice = createCar.AirportPrice,
                    DriverPrice = createCar.DriverPrice
                };

                _context.CarInfos.Add(carInfo);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return CreatedAtAction(nameof(GetCarById), new { id = car.Id }, car);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred while creating the car.", error = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(int id, CarCreateDto updateDto)
        {
            try
            {
                var car = await _context.Cars.FindAsync(id);
                var carInfo = await _context.CarInfos.FindAsync(id);

                if (car == null)
                {
                    return NotFound($"Car with ID {id} not found.");
                }

                if (carInfo == null)
                    return NotFound($"Car info with ID {id} not found.");

                byte[]? imageBytes = null;

                if (updateDto.MainImage != null)
                {
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                    var fileExtension = Path.GetExtension(updateDto.MainImage.FileName).ToLower();

                    if (!allowedExtensions.Contains(fileExtension))
                    {
                        return BadRequest("Invalid file type. Only JPG, PNG, and GIF are allowed.");
                    }

                    using var memoryStream = new MemoryStream();
                    await updateDto.MainImage.CopyToAsync(memoryStream);
                    imageBytes = memoryStream.ToArray();
                }

                car.Make = updateDto.Make;
                car.Model = updateDto.Model;
                car.Year = updateDto.Year;
                car.Transmission = updateDto.Transmission;
                car.Passengers = updateDto.Passengers;
                car.DailyPrice = updateDto.DailyPrice;
                car.MainImage = imageBytes;

                carInfo.HorsePower = updateDto.HorsePower;
                carInfo.EngineType = updateDto.EngineType;
                carInfo.AirportPrice = updateDto.AirportPrice;
                carInfo.DriverPrice = updateDto.DriverPrice;
                    
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating car information.", Error = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            try
            {
                var car = await _context.Cars.FindAsync(id);
                if (car == null)
                    return NotFound("Car not found.");

                _context.Cars.Remove(car);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the car.", error = ex.Message });
            }
        }

        [HttpGet("filter")]
        public async Task<IActionResult> FilterCars([FromQuery] CarFilterDto filterDto)
        {
            try
            {
                var filteredCars = _context.Cars.AsQueryable();

                if (filterDto.Makes != null && filterDto.Makes.Count != 0)
                {
                    filteredCars = filteredCars.Where(car => filterDto.Makes.Contains(car.Make));
                }

                if (filterDto.MinYear.HasValue)
                {
                    filteredCars = filteredCars.Where(car => car.Year >= filterDto.MinYear.Value);
                }

                if (filterDto.MaxYear.HasValue)
                {
                    filteredCars = filteredCars.Where(car => car.Year <= filterDto.MaxYear.Value);
                }

                if (filterDto.MinPrice.HasValue)
                {
                    filteredCars = filteredCars.Where(car => car.DailyPrice >= filterDto.MinPrice.Value);
                }

                if (filterDto.MaxPrice.HasValue)
                {
                    filteredCars = filteredCars.Where(car => car.DailyPrice <= filterDto.MaxPrice.Value);
                }

                if (!string.IsNullOrEmpty(filterDto.Transmission))
                {
                    filteredCars = filteredCars.Where(car => car.Transmission == filterDto.Transmission);
                }

                var result = await filteredCars.ToListAsync();


                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while filtering cars.", Error = ex.Message });
            }
        }

    }
}

