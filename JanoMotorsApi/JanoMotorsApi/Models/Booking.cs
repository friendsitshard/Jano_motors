using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JanoMotorsApi.Models
{
    public class Booking
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required int UserId { get; set; }
        public required int CarId { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
        public required decimal TotalPrice { get; set; }
        public required string Status { get; set; }

        [JsonIgnore]
        public User? User { get; set; }
        [JsonIgnore]
        public Car? Car { get; set; }
        [JsonIgnore]
        public ICollection<PaymentDoc>? PaymentDocs { get; set; }
    }
}
