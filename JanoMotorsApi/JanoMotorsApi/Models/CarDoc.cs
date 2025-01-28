using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JanoMotorsApi.Models
{
    public class CarDoc
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int CarId { get; set; }
        public required byte[] DocImage { get; set; }

        [JsonIgnore]
        public Car? Car { get; set; }
    }
}
