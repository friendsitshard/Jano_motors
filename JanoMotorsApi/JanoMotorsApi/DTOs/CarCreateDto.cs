using System.ComponentModel.DataAnnotations;

namespace JanoMotorsApi.DTOs
{
    public class CarCreateDto
    {
        public required string Make { get; set; }
        public required string Model { get; set; }
        [Range(1900, 2100, ErrorMessage = "Year must be a 4-digit number.")]
        public required short Year { get; set; }
        public string Transmission { get; set; } = null!;
        public byte Passengers { get; set; }
        public int DailyPrice { get; set; }
        public IFormFile? MainImage { get; set; }

        public required int HorsePower { get; set; }
        public required string EngineType { get; set; }
        public decimal? DriverPrice { get; set; }
        public decimal? AirportPrice { get; set; }
    }
}
