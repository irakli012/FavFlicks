using System;
using System.ComponentModel.DataAnnotations;

namespace favflicks.data.Models
{
    public class UserProfile
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = null!;
        public AppUser? User { get; set; }

        [StringLength(500)]
        public string? Bio { get; set; }

        [StringLength(100)]
        public string? Location { get; set; }

        public DateTime JoinDate { get; set; } = DateTime.UtcNow;

        [Url]
        [StringLength(500)]
        public string? ProfilePictureUrl { get; set; }

        [Url]
        [StringLength(500)]
        public string? CoverImageUrl { get; set; }
    }
}
