using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace favflicks.data.Models
{
    public class UserList
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = null!;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        public string UserId { get; set; } = null!;
        [JsonIgnore]
        public AppUser? User { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public ICollection<ListMovie> ListMovies { get; set; } = new List<ListMovie>();
    }
}
