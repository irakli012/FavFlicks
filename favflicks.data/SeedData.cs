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

    public static List<Movie> GetPredefinedMovies() =>
    [
        new Movie { Id = 1, Name = "Inception", Description = "A thief uses dream-sharing technology to infiltrate minds.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/inception.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 2, Name = "The Godfather", Description = "The aging patriarch of a crime dynasty transfers control to his son.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/godfather.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 3, Name = "Superbad", Description = "Two teens navigate friendship and parties before college.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/superbad.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 4, Name = "The Matrix", Description = "A hacker learns about the true nature of his reality.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/matrix.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 5, Name = "Interstellar", Description = "A team travels through a wormhole in space to ensure humanity's survival.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/interstellar.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 6, Name = "Pulp Fiction", Description = "The lives of criminals intertwine in this nonlinear story.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/pulpfiction.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 7, Name = "The Dark Knight", Description = "Batman faces his greatest challenge in the form of the Joker.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/darkknight.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 8, Name = "Forrest Gump", Description = "A man's simple outlook leads him through incredible life events.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/forrestgump.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 9, Name = "The Avengers", Description = "Earth's mightiest heroes must unite to save the world.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/avengers.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 10, Name = "Titanic", Description = "A romance unfolds aboard the ill-fated RMS Titanic.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/titanic.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 11, Name = "Gladiator", Description = "A betrayed Roman general seeks revenge.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/gladiator.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 12, Name = "Toy Story", Description = "Toys come to life when humans aren't around.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/toystory.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 13, Name = "Jurassic Park", Description = "A theme park suffers a major security breakdown with dinosaurs.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/jurassicpark.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 14, Name = "The Shawshank Redemption", Description = "Two imprisoned men bond over the years.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/shawshank.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 15, Name = "The Lion King", Description = "A lion cub's journey to reclaim his kingdom.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/lionking.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 16, Name = "Back to the Future", Description = "A teenager travels back in time to help his parents.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/backtothefuture.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 17, Name = "The Social Network", Description = "The story of Facebook's founding.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/socialnetwork.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 18, Name = "Fight Club", Description = "An office worker forms an underground fight club.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/fightclub.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 19, Name = "Coco", Description = "A boy journeys to the Land of the Dead to uncover family secrets.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/coco.jpg", DateAdded = DateTime.UtcNow },
        new Movie { Id = 20, Name = "La La Land", Description = "A jazz musician and an aspiring actress fall in love.", AddedByUserId = DefaultUserId, Source = MovieSource.UserImport, ImagePath = "/images/movies/lalaland.jpg", DateAdded = DateTime.UtcNow }
    ];

    public static object[] GetMovieTagRelations() =>
    [
        new { MoviesId = 1, TagsId = ActionTagId },
        new { MoviesId = 1, TagsId = SciFiTagId },
        new { MoviesId = 2, TagsId = DramaTagId },
        new { MoviesId = 3, TagsId = ComedyTagId },
        new { MoviesId = 4, TagsId = ActionTagId },
        new { MoviesId = 4, TagsId = SciFiTagId },
        new { MoviesId = 5, TagsId = SciFiTagId },
        new { MoviesId = 5, TagsId = DramaTagId },
        new { MoviesId = 6, TagsId = DramaTagId },
        new { MoviesId = 7, TagsId = ActionTagId },
        new { MoviesId = 7, TagsId = DramaTagId },
        new { MoviesId = 8, TagsId = DramaTagId },
        new { MoviesId = 9, TagsId = ActionTagId },
        new { MoviesId = 9, TagsId = SciFiTagId },
        new { MoviesId = 10, TagsId = DramaTagId },
        new { MoviesId = 11, TagsId = ActionTagId },
        new { MoviesId = 11, TagsId = DramaTagId },
        new { MoviesId = 12, TagsId = ComedyTagId },
        new { MoviesId = 12, TagsId = SciFiTagId },
        new { MoviesId = 13, TagsId = SciFiTagId },
        new { MoviesId = 13, TagsId = ActionTagId },
        new { MoviesId = 14, TagsId = DramaTagId },
        new { MoviesId = 15, TagsId = DramaTagId },
        new { MoviesId = 15, TagsId = ActionTagId },
        new { MoviesId = 16, TagsId = SciFiTagId },
        new { MoviesId = 16, TagsId = ComedyTagId },
        new { MoviesId = 17, TagsId = DramaTagId },
        new { MoviesId = 18, TagsId = DramaTagId },
        new { MoviesId = 19, TagsId = ComedyTagId },
        new { MoviesId = 19, TagsId = DramaTagId },
        new { MoviesId = 20, TagsId = DramaTagId },
        new { MoviesId = 20, TagsId = ComedyTagId }
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