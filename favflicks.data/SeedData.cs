using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using favflicks.data.Enums;
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

    public static List<Movie> GetPredefinedMovies() => [];

    public static object[] GetMovieTagRelations() => [];

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
            SecurityStamp = "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            ConcurrencyStamp = "b2c3d4e5-f6a7-8901-bcde-f12345678901"
        };
    }
}