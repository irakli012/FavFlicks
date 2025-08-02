using favflicks.data;
using favflicks.data.Enums;
using favflicks.data.Models;
using favflicks.data.Models.TMDB;
using favflicks.services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Retry;
using System.Net;
using System.Net.Http.Json;

namespace favflicks.services;

public class MovieService(
    AppDbContext context,
    IHttpClientFactory httpClientFactory,
    IOptions<TmdbSettings> tmdbOptions,
    ILogger<MovieService> logger) : IMovieService
{
    private readonly TmdbSettings _tmdbSettings = tmdbOptions.Value;
    private readonly AsyncRetryPolicy<HttpResponseMessage> _retryPolicy = Policy<HttpResponseMessage>
        .Handle<HttpRequestException>()
        .OrResult(x => x.StatusCode == HttpStatusCode.TooManyRequests)
        .WaitAndRetryAsync(3, retryAttempt =>
            TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

    public async Task<IEnumerable<Movie>> GetMovieListAsync(string userId)
    {
        return await context.Movies
            .Include(m => m.Tags)
            .Include(m => m.Comments)
            .Include(m => m.Ratings)
            .Include(m => m.Favorites)
            .AsNoTracking()
            .Select(m => new Movie
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                ImagePath = m.ImagePath,
                Source = m.Source,
                ExternalId = m.ExternalId,
                ExternalUrl = m.ExternalUrl,
                YouTubeTrailerId = m.YouTubeTrailerId,
                AverageRating = m.Ratings.Any() ? m.Ratings.Average(r => (int)r.Value) : 0,
                IsFavorite = m.Favorites.Any(f => f.UserId == userId),
                InWatchlist = m.Watchlists.Any(w => w.UserId == userId)
            })
            .ToListAsync();
    }

    public async Task<Movie?> GetMovieByIdAsync(int id, string userId)
    {
        return await context.Movies
            .Include(m => m.Tags)
            .Include(m => m.Comments)
            .Include(m => m.Ratings)
            .Include(m => m.Favorites)
            .Include(m => m.Watchlists)
            .Where(m => m.Id == id)
            .Select(m => new Movie
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                ImagePath = m.ImagePath,
                BackdropPath = m.BackdropPath,
                Source = m.Source,
                ExternalId = m.ExternalId,
                ExternalUrl = m.ExternalUrl,
                YouTubeTrailerId = m.YouTubeTrailerId,
                Director = m.Director,
                Writers = m.Writers,
                Stars = m.Stars,
                ReleaseDate = m.ReleaseDate,
                RuntimeMinutes = m.RuntimeMinutes,
                AverageRating = m.Ratings.Any() ? m.Ratings.Average(r => (int)r.Value) : 0,
                IsFavorite = m.Favorites.Any(f => f.UserId == userId),
                InWatchlist = m.Watchlists.Any(w => w.UserId == userId),
                Tags = m.Tags,
                Comments = m.Comments
            })
            .FirstOrDefaultAsync();
    }

    public async Task<Movie> AddManualMovieAsync(Movie movie, string userId)
    {
        movie.Source = MovieSource.UserImport;
        movie.AddedByUserId = userId;
        movie.DateAdded = DateTime.UtcNow;

        await ProcessTags(movie);
        context.Movies.Add(movie);
        await context.SaveChangesAsync();

        return movie;
    }

    public async Task<Movie> ImportFromTmdbAsync(int tmdbId, string userId)
    {
        using var httpClient = httpClientFactory.CreateClient("TMDB");

        try
        {
            var movieResponse = await httpClient.GetAsync(
                $"movie/{tmdbId}?api_key={_tmdbSettings.ApiKey}&append_to_response=videos");

            movieResponse.EnsureSuccessStatusCode();

            var tmdbMovie = await movieResponse.Content.ReadFromJsonAsync<TmdbMovieDetails>()
                ?? throw new Exception("TMDB movie data is null");

            // Process trailer - now using the correct path
            var trailer = tmdbMovie.Videos.Results
                .FirstOrDefault(v => v.Site == "YouTube" && v.Type == "Trailer");

            var movie = new Movie
            {
                Source = MovieSource.TMDB,
                ExternalId = tmdbId.ToString(),
                ExternalUrl = tmdbMovie.Homepage ?? $"https://www.themoviedb.org/movie/{tmdbId}",
                ImdbUrl = !string.IsNullOrEmpty(tmdbMovie.ImdbId)
                    ? $"https://www.imdb.com/title/{tmdbMovie.ImdbId}/"
                    : null,
                Name = tmdbMovie.Title,
                Description = tmdbMovie.Overview,
                YouTubeTrailerId = trailer?.Key,
                ImagePath = tmdbMovie.PosterPath != null
                    ? $"{_tmdbSettings.ImageBaseUrl}w500{tmdbMovie.PosterPath}"
                    : null,
                BackdropPath = tmdbMovie.BackdropPath != null
                    ? $"{_tmdbSettings.ImageBaseUrl}original{tmdbMovie.BackdropPath}"
                    : null,
                ReleaseDate = tmdbMovie.ReleaseDate,
                RuntimeMinutes = tmdbMovie.Runtime,
                Director = tmdbMovie.Credits?.Crew?
                    .FirstOrDefault(c => c.Job == "Director")?.Name,
                AddedByUserId = userId,
                DateAdded = DateTime.UtcNow
            };

            context.Movies.Add(movie);
            await context.SaveChangesAsync();

            return movie;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error importing movie from TMDB with ID {TmdbId}", tmdbId);
            throw;
        }
    }

    public async Task UpdateAsync(Movie movie)
    {
        var existing = await context.Movies
            .Include(m => m.Tags)
            .FirstOrDefaultAsync(m => m.Id == movie.Id)
            ?? throw new InvalidOperationException("Movie not found");

        // Preserve source-specific fields
        if (existing.Source == MovieSource.TMDB)
        {
            movie.Source = existing.Source;
            movie.ExternalId = existing.ExternalId;
            movie.ExternalUrl = existing.ExternalUrl;
            movie.ImdbUrl = existing.ImdbUrl;
        }

        existing.Name = movie.Name;
        existing.Description = movie.Description;
        existing.ImagePath = movie.ImagePath;
        existing.BackdropPath = movie.BackdropPath;
        existing.YouTubeTrailerId = movie.YouTubeTrailerId;
        existing.Director = movie.Director;
        existing.Writers = movie.Writers;
        existing.Stars = movie.Stars;
        existing.ReleaseDate = movie.ReleaseDate;
        existing.RuntimeMinutes = movie.RuntimeMinutes;

        // Handle tags
        existing.Tags.Clear();
        var tagIds = movie.Tags.Select(t => t.Id).ToList();
        var tags = await context.Tags.Where(t => tagIds.Contains(t.Id)).ToListAsync();
        existing.Tags = tags;

        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var rowsAffected = await context.Movies
            .Where(m => m.Id == id)
            .ExecuteDeleteAsync();

        if (rowsAffected == 0)
        {
            throw new InvalidOperationException("Movie not found");
        }
    }

    public async Task<IEnumerable<Movie>> SearchTmdbMoviesAsync(string query)
    {
        using var httpClient = httpClientFactory.CreateClient("TMDB");

        try
        {
            var response = await _retryPolicy.ExecuteAsync(() =>
                httpClient.GetAsync(
                    $"search/movie?api_key={_tmdbSettings.ApiKey}&query={Uri.EscapeDataString(query)}"));

            response.EnsureSuccessStatusCode();

            var tmdbResults = await response.Content.ReadFromJsonAsync<TmdbSearchResponse>()
                ?? throw new Exception("TMDB search results are null");

            return tmdbResults.Results.Select(m => new Movie
            {
                Source = MovieSource.TMDB,
                ExternalId = m.Id.ToString(),
                Name = m.Title,
                Description = m.Overview,
                ImagePath = m.PosterPath != null
                    ? $"{_tmdbSettings.ImageBaseUrl}w500{m.PosterPath}"
                    : null,
                ReleaseDate = m.ReleaseDate,
                AverageRating = m.VoteAverage,
                ExternalUrl = $"https://www.themoviedb.org/movie/{m.Id}"
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error searching TMDB for query {Query}", query);
            return Enumerable.Empty<Movie>();
        }
    }

    public async Task<IEnumerable<Movie>> SearchAllSourcesAsync(string query)
    {
        var localResults = await context.Movies
            .Where(m => m.Name.Contains(query))
            .Take(20)
            .AsNoTracking()
            .ToListAsync();

        var tmdbResults = await SearchTmdbMoviesAsync(query);

        return localResults.Concat(tmdbResults)
            .OrderByDescending(m => m.AverageRating)
            .Take(50);
    }

    public async Task<Movie?> GetMovieFromAllSourcesAsync(int id, string source, string userId)
    {
        if (!Enum.TryParse<MovieSource>(source, out var movieSource))
        {
            return null;
        }

        return movieSource switch
        {
            MovieSource.TMDB => await ImportFromTmdbAsync(id, userId),
            MovieSource.UserImport => await GetMovieByIdAsync(id, userId),
            _ => null
        };
    }

    private async Task ProcessTags(Movie movie)
    {
        var tagIds = movie.Tags.Select(t => t.Id).ToList();
        var existingTags = await context.Tags
            .Where(t => tagIds.Contains(t.Id))
            .ToListAsync();
        movie.Tags = existingTags;
    }
}