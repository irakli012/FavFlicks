using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using favflicks.data.Models;

namespace favflicks.data;

public static class SeedData
{
    public static readonly string DefaultUserId = "00000000-0000-0000-0000-000000000000";

    // Predefined tag IDs
    public const int ActionTagId = 1;
    public const int ComedyTagId = 2;
    public const int DramaTagId = 3;
    public const int SciFiTagId = 4;

    public static List<Tag> GetPredefinedTags() =>
    [
        new Tag { Id = ActionTagId, Name = "Action" },
        new Tag { Id = ComedyTagId, Name = "Comedy" },
        new Tag { Id = DramaTagId, Name = "Drama" },
        new Tag { Id = SciFiTagId, Name = "Sci-Fi" }
    ];

    public static List<Movie> GetPredefinedMovies() =>
    [
        new Movie
        {
            Id = 1,
            Name = "Inception",
            Description = "A thief uses dream-sharing technology to infiltrate minds.",
            UserId = DefaultUserId,
            ImagePath = "/images/movies/inception.jpg"
        },
        new Movie
        {
            Id = 2,
            Name = "The Godfather",
            Description = "The aging patriarch of a crime dynasty transfers control to his son.",
            UserId = DefaultUserId,
            ImagePath = "/images/movies/godfather.jpg"
        },
        new Movie
        {
            Id = 3,
            Name = "Superbad",
            Description = "Two teens navigate friendship and parties before college.",
            UserId = DefaultUserId,
            ImagePath = "/images/movies/superbad.jpg"
        }
    ];

    public static object[] GetMovieTagRelations() =>
    [
        new { MoviesId = 1, TagsId = ActionTagId },
        new { MoviesId = 1, TagsId = SciFiTagId },
        new { MoviesId = 2, TagsId = DramaTagId },
        new { MoviesId = 3, TagsId = ComedyTagId }
    ];

    public static AppUser GetDefaultUser()
    {
        return new AppUser
        {
            Id = DefaultUserId,
            UserName = "testuser",
            NormalizedUserName = "TESTUSER",
            Email = "defaultuser@example.com",
            NormalizedEmail = "DEFAULTUSER@EXAMPLE.COM",
            EmailConfirmed = true,
            SecurityStamp = Guid.NewGuid().ToString(),
            ConcurrencyStamp = Guid.NewGuid().ToString()
        };
    }
}
