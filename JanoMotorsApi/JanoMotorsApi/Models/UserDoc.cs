using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JanoMotorsApi.Models
{
    public class UserDoc
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int UserId { get; set; }
        public required string Type { get; set; }
        public required byte[] DocImage { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

    }
}
