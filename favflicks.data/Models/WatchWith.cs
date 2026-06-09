using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using favflicks.data.Enums;

namespace favflicks.data.Models
{
    public class WatchWith
    {
        public int Id { get; set; }

        [Required]
        public string InitiatorUserId { get; set; }
        [JsonIgnore]
        public AppUser? InitiatorUser { get; set; }

        [Required]
        public string TargetUserId { get; set; }
        [JsonIgnore]
        public AppUser? TargetUser { get; set; }

        [Required]
        public int MovieId { get; set; }
        [JsonIgnore]
        public Movie? Movie { get; set; }

        public DateTime AddedDate { get; set; } = DateTime.UtcNow;

        public WatchWithStatus Status { get; set; } = WatchWithStatus.Pending;
    }
}
