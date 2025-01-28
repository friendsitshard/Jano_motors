using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JanoMotorsApi.Models
{
    public class Role
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required string Name { get; set; }

        [JsonIgnore]
        public ICollection<User>? Users { get; set; }
    }
}
