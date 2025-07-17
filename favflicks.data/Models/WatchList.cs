using System.ComponentModel.DataAnnotations;

namespace favflicks.data.Models
{
    public class WatchList
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }
        public AppUser? User { get; set; }

        [Required]
        public int MovieId { get; set; }
        public Movie? Movie { get; set; }

        public DateTime AddedDate { get; set; } = DateTime.UtcNow;
    }
}