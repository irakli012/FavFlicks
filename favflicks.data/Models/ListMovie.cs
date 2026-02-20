using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace favflicks.data.Models
{
    public class ListMovie
    {
        public int Id { get; set; }

        [Required]
        public int UserListId { get; set; }
        [JsonIgnore]
        public UserList? UserList { get; set; }

        [Required]
        public int MovieId { get; set; }
        [JsonIgnore]
        public Movie? Movie { get; set; }

        public DateTime AddedDate { get; set; } = DateTime.UtcNow;
    }
}
