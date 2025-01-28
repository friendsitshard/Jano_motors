using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JanoMotorsApi.Models
{
    public class Car
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required string Make { get; set; }
        public required string Model { get; set; }
        [Range(1900, 2100, ErrorMessage = "Year must be a 4-digit number.")]
        public required short Year { get; set; }
        public required string Transmission { get; set; }
        public required byte Passengers { get; set; }
        public byte[]? MainImage { get; set; }
        public required int DailyPrice { get; set; }

        [JsonIgnore]
        public ICollection<Booking>? Bookings { get; set; }
        [JsonIgnore]
        public CarInfo? CarInfo { get; set; }
        [JsonIgnore]
        public ICollection<CarDoc>? CarDocs { get; set; }
    }
}
