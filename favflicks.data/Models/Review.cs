using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace favflicks.data.Models
{
    public class Review
    {
        public int Id { get; set; }

        [Required]
        [StringLength(2000)]
        public string Content { get; set; } = null!;

        [Required]
        [Range(1, 10)]
        public int Rating { get; set; }

        [Required]
        public int MovieId { get; set; }
        [JsonIgnore]
        public Movie? Movie { get; set; }

        [Required]
        public string UserId { get; set; } = null!;
        [JsonIgnore]
        public AppUser? User { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedDate { get; set; }
    }
}
