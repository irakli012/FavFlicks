using favflicks.data.Enums;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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

        // TMDB Fields
        public MovieSource Source { get; set; } = MovieSource.UserImport;
        public string? ExternalId { get; set; }

        public string? YouTubeTrailerId { get; set; }   
        public string? ImagePath { get; set; }
        public string? BackdropPath { get; set; }

        [NotMapped]
        public double AverageRating { get; set; }

        [NotMapped]
        public bool IsFavorite { get; set; }

        [NotMapped]
        public bool InWatchlist { get; set; }

        public string? Director { get; set; }

        public string? Writers { get; set; }

        public string? Stars { get; set; }

        public DateTime? ReleaseDate { get; set; }

        public string? CountryOfOrigin { get; set; }

        public string? Language { get; set; }

        public string? ProductionCompany { get; set; }

        public int? RuntimeMinutes { get; set; }

        public string? Genre { get; set; }

        // User Management
        [BindNever]
        public string? AddedByUserId { get; set; }
        public AppUser? AddedByUser { get; set; }
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
        public ICollection<MovieRating> Ratings { get; set; } = new List<MovieRating>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public ICollection<WatchList> Watchlists { get; set; } = new List<WatchList>();

        [NotMapped]
        public string TrailerUrl =>
                    !string.IsNullOrEmpty(YouTubeTrailerId)
                        ? $"https://www.youtube.com/embed/{YouTubeTrailerId}?autoplay=1"
                        : null;
    }
}
        