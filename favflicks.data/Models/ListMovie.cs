using System;
using System.ComponentModel.DataAnnotations;

namespace favflicks.data.Models
{
    public class ListMovie
    {
        public int Id { get; set; }

        [Required]
        public int UserListId { get; set; }
        public UserList? UserList { get; set; }

        [Required]
        public int MovieId { get; set; }
        public Movie? Movie { get; set; }

        public DateTime AddedDate { get; set; } = DateTime.UtcNow;
    }
}
