using favflicks.data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.data.Models
{
    public class Movie
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public string UserId { get; set; } = null!;
        public AppUser? User { get; set; }

        public string? ImagePath { get; set; }

        [NotMapped]
        public double AverageRating { get; set; }

        [NotMapped]
        public bool IsFavorite { get; set; }


        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
        public ICollection<MovieRating> Ratings { get; set; } = new List<MovieRating>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();


    }
}
        