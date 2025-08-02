using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using favflicks.data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace favflicks.data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<AppUser>(options)
    {
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<MovieRating> MovieRatings { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<WatchList> WatchList { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Movie entity
            modelBuilder.Entity<Movie>(entity =>
            {
                // Configure enum conversion
                entity.Property(m => m.Source)
                    .HasConversion<string>()
                    .HasMaxLength(20);

                // Configure string lengths
                entity.Property(m => m.Name).HasMaxLength(200);
                entity.Property(m => m.Description).HasMaxLength(1000);
                entity.Property(m => m.ImagePath).HasMaxLength(500);
                entity.Property(m => m.BackdropPath).HasMaxLength(500);
                entity.Property(m => m.YouTubeTrailerId).HasMaxLength(20);
                entity.Property(m => m.ExternalId).HasMaxLength(50);
                entity.Property(m => m.ExternalUrl).HasMaxLength(500);
                entity.Property(m => m.ImdbUrl).HasMaxLength(500);
                entity.Property(m => m.Director).HasMaxLength(100);
                entity.Property(m => m.Writers).HasMaxLength(500);
                entity.Property(m => m.Stars).HasMaxLength(500);
                entity.Property(m => m.CountryOfOrigin).HasMaxLength(100);
                entity.Property(m => m.Language).HasMaxLength(100);
                entity.Property(m => m.ProductionCompany).HasMaxLength(200);
                entity.Property(m => m.Genre).HasMaxLength(200);
            });

            // Configure Comment entity
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasOne(c => c.Movie)
                    .WithMany(m => m.Comments)
                    .HasForeignKey(c => c.MovieId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.User)
                    .WithMany(u => u.Comments)
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Favorite entity
            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasOne(f => f.Movie)
                    .WithMany(m => m.Favorites)
                    .HasForeignKey(f => f.MovieId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(f => f.User)
                    .WithMany(u => u.Favorites)
                    .HasForeignKey(f => f.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure MovieRating entity
            modelBuilder.Entity<MovieRating>(entity =>
            {
                entity.HasOne(r => r.Movie)
                    .WithMany(m => m.Ratings)
                    .HasForeignKey(r => r.MovieId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.User)
                    .WithMany(u => u.Ratings)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Watchlist entity (new)
            modelBuilder.Entity<WatchList>(entity =>
            {
                entity.HasOne(w => w.Movie)
                    .WithMany(m => m.Watchlists)
                    .HasForeignKey(w => w.MovieId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(w => w.User)
                    .WithMany(u => u.watchLists)
                    .HasForeignKey(w => w.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure many-to-many for Movie-Tag
            modelBuilder.Entity<Movie>()
                .HasMany(m => m.Tags)
                .WithMany(t => t.Movies)
                .UsingEntity(j => j.ToTable("MovieTags"));

            // Seed data
            modelBuilder.Entity<AppUser>().HasData(SeedData.GetDefaultUser());
            modelBuilder.Entity<Tag>().HasData(SeedData.GetPredefinedTags());

            // Seed movies without navigation properties
            modelBuilder.Entity<Movie>().HasData(SeedData.GetPredefinedMovies().Select(m => new
            {
                m.Id,
                m.Name,
                m.Description,
                m.ImagePath,
                m.AddedByUserId,
                m.Source,
                m.DateAdded,
                m.YouTubeTrailerId,
                m.BackdropPath,
                m.ExternalId,
                m.ExternalUrl,
                m.ImdbUrl,
                m.Director,
                m.Writers,
                m.Stars,
                m.ReleaseDate,
                m.CountryOfOrigin,
                m.Language,
                m.ProductionCompany,
                m.RuntimeMinutes,
                m.Genre
            }));

            // Seed movie-tag relationships
            modelBuilder.Entity("MovieTag").HasData(SeedData.GetMovieTagRelations());
        }
    }
}
