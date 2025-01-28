using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JanoMotorsApi.Models
{
    public class CarInfo
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required int HorsePower { get; set; }
        public required string EngineType { get; set; }
        public decimal? DriverPrice { get; set; }
        public decimal? AirportPrice { get; set; }

        [JsonIgnore]
        public Car? Car { get; set; }
    }
}
