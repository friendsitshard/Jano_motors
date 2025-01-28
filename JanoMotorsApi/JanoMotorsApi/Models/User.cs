using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JanoMotorsApi.Models
{
    public class User
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [EmailAddress]
        public required string Email { get; set; }
        [MinLength(6)]
        public required string Password { get; set; }
        public bool IsVerified { get; set; } = false;
        public int RoleId { get; set; } = 1;

        [JsonIgnore]
        public UserInfo? UserInfo { get; set; } = null!;
        [JsonIgnore]
        public Role? Role { get; set; }
        [JsonIgnore]
        public ICollection<UserDoc>? UserDocs { get; set; }
        [JsonIgnore]
        public ICollection<Booking>? Bookings { get; set; }
    }
}
