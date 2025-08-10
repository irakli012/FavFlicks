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
using System.Text.Json;

namespace favflicks.services;

public class MovieService : IMovieService
{
    private readonly AppDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly TmdbSettings _tmdbSettings;
    private readonly ILogger<MovieService> _logger;
    private readonly AsyncRetryPolicy<HttpResponseMessage> _retryPolicy;

    public MovieService(
        AppDbContext context,
        IHttpClientFactory httpClientFactory,
        IOptions<TmdbSettings> tmdbOptions,
        ILogger<MovieService> logger)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _tmdbSettings = tmdbOptions.Value;
        _logger = logger;

        _retryPolicy = Policy<HttpResponseMessage>
            .Handle<HttpRequestException>()
            .OrResult(x => x.StatusCode == HttpStatusCode.TooManyRequests)
            .WaitAndRetryAsync(3, retryAttempt =>
                TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
    }

    public async Task<IEnumerable<Movie>> GetLocalMoviesAsync(string userId)
    {
        return await _context.Movies
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

    public async Task<IEnumerable<Movie>> GetAllMoviesAsync(string userId, bool includeTmdb = false)
    {
        try
        {
            // Get local movies
            var localMovies = await GetLocalMoviesAsync(userId);

            if (!includeTmdb)
            {
                _logger.LogInformation("Returning {Count} local movies only", localMovies.Count());
                return localMovies;
            }

            // Get popular TMDB movies
            var tmdbMovies = await GetPopularTmdbMoviesAsync();
            _logger.LogInformation("Found {Count} TMDB movies", tmdbMovies.Count());

            // Combine results
            var combinedMovies = localMovies
                .Concat(tmdbMovies)
                .OrderByDescending(m => m.AverageRating)
                .ToList();

            _logger.LogInformation("Returning {Count} combined movies", combinedMovies.Count);
            return combinedMovies;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAllMoviesAsync");
            throw;
        }
    }

    public async Task<IEnumerable<Movie>> GetPopularTmdbMoviesAsync()
    {
        using var httpClient = _httpClientFactory.CreateClient("TMDB");

        try
        {
            var response = await _retryPolicy.ExecuteAsync(() =>
                httpClient.GetAsync($"movie/popular?api_key={_tmdbSettings.ApiKey}"));

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            _logger.LogDebug("TMDB API Response: {Content}", content);

            // Parse manually to better handle errors
            using JsonDocument doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            if (!root.TryGetProperty("results", out var resultsElement))
            {
                _logger.LogWarning("TMDB response missing 'results' property");
                return Enumerable.Empty<Movie>();
            }

            var movies = new List<Movie>();
            foreach (var result in resultsElement.EnumerateArray())
            {
                try
                {
                    var movie = new Movie
                    {
                        Source = MovieSource.TMDB,
                        ExternalId = result.GetProperty("id").GetInt32().ToString(),
                        Name = result.GetProperty("title").GetString(),
                        Description = result.GetProperty("overview").GetString(),
                        ImagePath = result.GetProperty("poster_path").GetString() != null
                            ? $"{_tmdbSettings.ImageBaseUrl}w500{result.GetProperty("poster_path").GetString()}"
                            : null,
                        BackdropPath = result.GetProperty("backdrop_path").GetString() != null
                            ? $"{_tmdbSettings.ImageBaseUrl}original{result.GetProperty("backdrop_path").GetString()}"
                            : null,
                        ReleaseDate = result.GetProperty("release_date").GetString() != null
                            ? DateTime.Parse(result.GetProperty("release_date").GetString())
                            : null,
                        AverageRating = (double)result.GetProperty("vote_average").GetDecimal(),
                        ExternalUrl = $"https://www.themoviedb.org/movie/{result.GetProperty("id").GetInt32()}",
                        Tags = new List<Tag>(),
                        Ratings = new List<MovieRating>(),
                        Comments = new List<Comment>(),
                        Favorites = new List<Favorite>(),
                        Watchlists = new List<WatchList>()
                    };
                    movies.Add(movie);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error parsing TMDB movie result");
                }
            }

            _logger.LogInformation("Successfully parsed {Count} TMDB movies", movies.Count);
            return movies;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching popular TMDB movies");
            return Enumerable.Empty<Movie>();
        }
    }

    public async Task<Movie?> GetMovieByIdAsync(int id, string userId)
    {
        return await _context.Movies
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
        _context.Movies.Add(movie);
        await _context.SaveChangesAsync();

        return movie;
    }

    public async Task UpdateAsync(Movie movie)
    {
        var existing = await _context.Movies
            .Include(m => m.Tags)
            .FirstOrDefaultAsync(m => m.Id == movie.Id)
            ?? throw new InvalidOperationException("Movie not found");

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
        var tags = await _context.Tags.Where(t => tagIds.Contains(t.Id)).ToListAsync();
        existing.Tags = tags;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var rowsAffected = await _context.Movies
            .Where(m => m.Id == id)
            .ExecuteDeleteAsync();

        if (rowsAffected == 0)
        {
            throw new InvalidOperationException("Movie not found");
        }
    }

    public async Task<Movie> ImportFromTmdbAsync(int tmdbId, string userId)
    {
        using var httpClient = _httpClientFactory.CreateClient("TMDB");

        try
        {
            _logger.LogInformation("Starting TMDB import for ID: {TmdbId}", tmdbId);

            var movieResponse = await _retryPolicy.ExecuteAsync(() =>
                httpClient.GetAsync($"movie/{tmdbId}?api_key={_tmdbSettings.ApiKey}&append_to_response=videos,credits"));

            if (!movieResponse.IsSuccessStatusCode)
            {
                var errorContent = await movieResponse.Content.ReadAsStringAsync();
                _logger.LogError("TMDB API error: {StatusCode} - {Content}",
                    movieResponse.StatusCode, errorContent);
                throw new Exception($"TMDB API error: {movieResponse.StatusCode}");
            }

            var content = await movieResponse.Content.ReadAsStringAsync();
            _logger.LogDebug("TMDB API response: {Content}", content);

            var tmdbMovie = JsonSerializer.Deserialize<TmdbMovieDetails>(content)
                ?? throw new Exception("Failed to deserialize TMDB movie data");

            var trailer = tmdbMovie.Videos?.Results?
                .FirstOrDefault(v => v.Site == "YouTube" && v.Type == "Trailer");

            var genres = tmdbMovie.Genres?.Select(g => g.Name)?.ToList();

            var stars = tmdbMovie.Credits?.Cast?
                .Take(5)
                .Select(c => c.Name)?.ToList();

            var director = tmdbMovie.Credits?.Crew?
                .FirstOrDefault(c => c.Job == "Director")?.Name;

            var writers = tmdbMovie.Credits?.Crew?
                .Where(c => c.Job == "Screenplay" || c.Job == "Writer")
                .Select(c => c.Name)?.ToList();

            var movie = new Movie
            {
                Source = MovieSource.TMDB,
                ExternalId = tmdbId.ToString(),
                Name = tmdbMovie.Title ?? "Untitled Movie",
                Description = tmdbMovie.Overview ?? "No description available",
                ImagePath = tmdbMovie.PosterPath != null
                    ? $"{_tmdbSettings.ImageBaseUrl}w500{tmdbMovie.PosterPath}"
                    : null,
                BackdropPath = tmdbMovie.BackdropPath != null
                    ? $"{_tmdbSettings.ImageBaseUrl}original{tmdbMovie.BackdropPath}"
                    : null,
                YouTubeTrailerId = trailer?.Key,
                ExternalUrl = tmdbMovie.Homepage ?? $"https://www.themoviedb.org/movie/{tmdbId}",
                ImdbUrl = !string.IsNullOrEmpty(tmdbMovie.ImdbId)
                    ? $"https://www.imdb.com/title/{tmdbMovie.ImdbId}/"
                    : null,
                ReleaseDate = tmdbMovie.ReleaseDate,
                RuntimeMinutes = tmdbMovie.Runtime,
                Director = director,
                Writers = writers != null ? string.Join(", ", writers) : null,
                Stars = stars != null ? string.Join(", ", stars) : null,
                Genre = genres != null ? string.Join(", ", genres) : null,
                AddedByUserId = userId,
                DateAdded = DateTime.UtcNow
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Successfully imported TMDB movie: {MovieName} (ID: {TmdbId})",
                movie.Name, tmdbId);

            return movie;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error importing movie from TMDB with ID {TmdbId}", tmdbId);
            throw;
        }
    }

    public async Task<IEnumerable<Movie>> SearchTmdbMoviesAsync(string query)
    {
        using var httpClient = _httpClientFactory.CreateClient("TMDB");

        try
        {
            var encodedQuery = Uri.EscapeDataString(query);
            var url = $"search/movie?api_key={_tmdbSettings.ApiKey}&query={encodedQuery}";

            _logger.LogInformation("Searching TMDB with URL: {Url}", url);

            var response = await _retryPolicy.ExecuteAsync(() => httpClient.GetAsync(url));

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("TMDB search failed: {StatusCode} - {Content}",
                    response.StatusCode, errorContent);
                return Enumerable.Empty<Movie>();
            }

            var content = await response.Content.ReadAsStringAsync();
            var tmdbResults = JsonSerializer.Deserialize<TmdbSearchResponse>(content);

            if (tmdbResults?.Results == null)
            {
                _logger.LogWarning("TMDB returned null search results");
                return Enumerable.Empty<Movie>();
            }

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
            _logger.LogError(ex, "Error searching TMDB for query {Query}", query);
            return Enumerable.Empty<Movie>();
        }
    }

    public async Task<IEnumerable<Movie>> SearchAllSourcesAsync(string query)
    {
        try
        {
            // Get local results (case insensitive)
            var localResults = await _context.Movies
                .Where(m => EF.Functions.Like(m.Name, $"%{query}%"))
                .Take(20)
                .AsNoTracking()
                .ToListAsync();

            _logger.LogInformation("Found {Count} local results for query: {Query}",
                localResults.Count, query);

            // Get TMDB results
            var tmdbResults = await SearchTmdbMoviesAsync(query);

            _logger.LogInformation("Found {Count} TMDB results for query: {Query}",
                tmdbResults.Count(), query);

            // Combine and return results
            return localResults
                .Concat(tmdbResults)
                .OrderByDescending(m => m.AverageRating)
                .Take(50)
                .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in SearchAllSourcesAsync for query: {Query}", query);
            return Enumerable.Empty<Movie>();
        }
    }

    public async Task<Movie?> GetMovieFromAllSourcesAsync(int id, string source, string userId)
    {
        if (!Enum.TryParse<MovieSource>(source, out var movieSource))
        {
            _logger.LogWarning("Invalid movie source: {Source}", source);
            return null;
        }

        try
        {
            return movieSource switch
            {
                MovieSource.TMDB => await ImportFromTmdbAsync(id, userId),
                MovieSource.UserImport => await GetMovieByIdAsync(id, userId),
                _ => null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting movie from source {Source} with ID {Id}",
                source, id);
            return null;
        }
    }

    private async Task ProcessTags(Movie movie)
    {
        var tagIds = movie.Tags.Select(t => t.Id).ToList();
        var existingTags = await _context.Tags
            .Where(t => tagIds.Contains(t.Id))
            .ToListAsync();
        movie.Tags = existingTags;
    }
}