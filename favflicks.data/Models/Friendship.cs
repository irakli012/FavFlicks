using favflicks.data.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace favflicks.data.Models
{
    public class Friendship
    {
        public int Id { get; set; }

        [Required]
        public string RequesterId { get; set; }
        [JsonIgnore]
        public AppUser? Requester { get; set; }

        [Required]
        public string AddresseeId { get; set; }
        [JsonIgnore]
        public AppUser? Addressee { get; set; }

        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
