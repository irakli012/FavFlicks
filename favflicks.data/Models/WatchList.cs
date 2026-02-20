using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace favflicks.data.Models
{
    public class WatchList
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }
        [JsonIgnore]
        public AppUser? User { get; set; }

        [Required]
        public int MovieId { get; set; }
        [JsonIgnore]
        public Movie? Movie { get; set; }

        public DateTime AddedDate { get; set; } = DateTime.UtcNow;
    }
}