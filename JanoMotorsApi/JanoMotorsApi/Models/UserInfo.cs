using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace JanoMotorsApi.Models
{
    public class UserInfo
    {
        public int Id { get; set; }
        [StringLength(13)]
        public required string PhoneNumber { get; set; }
        [MinLength(1)]
        public required string Firstname { get; set; }
        [MinLength(1)]
        public required string Lastname { get; set; }
        public required DateOnly DateOfBirth { get; set; }
        public byte[]? ProfileImage { get; set; }

        [JsonIgnore]
        public User User { get; set; } = null!;
    }
}
