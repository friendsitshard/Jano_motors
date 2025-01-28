using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JanoMotorsApi.Models
{
    public class PaymentDoc
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int BookingId { get; set; }
        public required string Type { get; set; }
        public required byte[] DocImage { get; set; }

        [JsonIgnore]
        public Booking? Booking { get; set; }
    }
}
