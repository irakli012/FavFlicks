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

    private static readonly Dictionary<int, string> TmdbGenreMap = new()
    {
        { 28, "Action" },
        { 12, "Adventure" },
        { 16, "Animation" },
        { 35, "Comedy" },
        { 80, "Crime" },
        { 99, "Documentary" },
        { 18, "Drama" },
        { 10751, "Family" },
        { 14, "Fantasy" },
        { 36, "History" },
        { 27, "Horror" },
        { 10402, "Music" },
        { 9648, "Mystery" },
        { 10749, "Romance" },
        { 878, "Sci-Fi" },
        { 10770, "TV Movie" },
        { 53, "Thriller" },
        { 10752, "War" },
        { 37, "Western" },
        { 10759, "Action & Adventure" },
        { 10765, "Sci-Fi & Fantasy" }
    };

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
            .Where(m => m.IsApproved)
            .Include(m => m.Tags)
            .Include(m => m.Comments)
            .Include(m => m.Ratings)
            .Include(m => m.Favorites)
            .Include(m => m.AddedByUser)
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
                Genre = m.Genre,
                ReleaseDate = m.ReleaseDate,
                DateAdded = m.DateAdded,
                AverageRating = m.Ratings.Any() ? m.Ratings.Average(r => (int)r.Value) : 0,
                AddedByUserId = m.AddedByUserId,
                AddedByUser = m.AddedByUser != null ? new AppUser { Id = m.AddedByUser.Id, UserName = m.AddedByUser.UserName } : null,
                IsFavorite = m.Favorites.Any(f => f.UserId == userId),
                InWatchlist = m.Watchlists.Any(w => w.UserId == userId)
            })
            .ToListAsync();
    }

    private static readonly Dictionary<string, int> MovieGenreToIdMap = new(StringComparer.OrdinalIgnoreCase)
    {
        { "Action", 28 },
        { "Adventure", 12 },
        { "Animation", 16 },
        { "Comedy", 35 },
        { "Crime", 80 },
        { "Documentary", 99 },
        { "Drama", 18 },
        { "Family", 10751 },
        { "Fantasy", 14 },
        { "History", 36 },
        { "Horror", 27 },
        { "Music", 10402 },
        { "Mystery", 9648 },
        { "Romance", 10749 },
        { "Sci-Fi", 878 },
        { "TV Movie", 10770 },
        { "Thriller", 53 },
        { "War", 10752 },
        { "Western", 37 }
    };

    private static readonly Dictionary<string, int> TvGenreToIdMap = new(StringComparer.OrdinalIgnoreCase)
    {
        { "Action & Adventure", 10759 },
        { "Animation", 16 },
        { "Comedy", 35 },
        { "Crime", 80 },
        { "Documentary", 99 },
        { "Drama", 18 },
        { "Family", 10751 },
        { "Kids", 10762 },
        { "Mystery", 9648 },
        { "News", 10763 },
        { "Reality", 10764 },
        { "Sci-Fi & Fantasy", 10765 },
        { "Soap", 10766 },
        { "Talk", 10767 },
        { "War & Politics", 10768 },
        { "Western", 37 }
    };

    public async Task<IEnumerable<Movie>> GetAllMoviesAsync(string userId, bool includeTmdb = false, string? genre = null, string? sortBy = null)
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

            // Get popular TMDB movies with genre/sort options
            var tmdbMovies = await GetPopularTmdbMoviesAsync(genre, sortBy);
            _logger.LogInformation("Found {Count} TMDB movies", tmdbMovies.Count());

            // Deduplicate local movies and TMDB movies
            var localMoviesList = localMovies.ToList();
            foreach (var tmdbMovie in tmdbMovies)
            {
                var existing = localMoviesList.FirstOrDefault(m =>
                    (!string.IsNullOrEmpty(m.ExternalId) && m.ExternalId == tmdbMovie.ExternalId) ||
                    (!string.IsNullOrEmpty(m.Name) && m.Name.Equals(tmdbMovie.Name, StringComparison.OrdinalIgnoreCase))
                );

                if (existing != null)
                {
                    if (existing.AverageRating <= 0)
                    {
                        existing.AverageRating = tmdbMovie.AverageRating;
                    }
                    if (string.IsNullOrEmpty(existing.Genre))
                    {
                        existing.Genre = tmdbMovie.Genre;
                    }
                    if (string.IsNullOrEmpty(existing.ImagePath))
                    {
                        existing.ImagePath = tmdbMovie.ImagePath;
                    }
                    if (string.IsNullOrEmpty(existing.ExternalId))
                    {
                        existing.ExternalId = tmdbMovie.ExternalId;
                    }
                }
                else
                {
                    localMoviesList.Add(tmdbMovie);
                }
            }

            var combinedMovies = localMoviesList.ToList();
            _logger.LogInformation("Returning {Count} combined movies", combinedMovies.Count);
            return combinedMovies;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAllMoviesAsync");
            throw;
        }
    }

    public async Task<IEnumerable<Movie>> GetPopularTmdbMoviesAsync(string? genre = null, string? sortBy = null)
    {
        using var httpClient = _httpClientFactory.CreateClient("TMDB");

        try
        {
            var movies = new List<Movie>();
            var tasks = new List<Task<HttpResponseMessage>>();

            int? genreId = null;
            if (!string.IsNullOrEmpty(genre) && MovieGenreToIdMap.TryGetValue(genre, out var gId))
            {
                genreId = gId;
            }

            string tmdbSort = sortBy switch
            {
                "rated" => "vote_average.desc",
                "newest" => "primary_release_date.desc",
                _ => "popularity.desc"
            };

            // If a specific genre or sort is selected, use TMDB Discover endpoint
            if (genreId.HasValue || (sortBy != null && sortBy != "popular"))
            {
                for (int page = 1; page <= 4; page++)
                {
                    var p = page;
                    var url = $"discover/movie?api_key={_tmdbSettings.ApiKey}&page={p}&sort_by={tmdbSort}";
                    if (genreId.HasValue) url += $"&with_genres={genreId.Value}";
                    if (sortBy == "rated") url += "&vote_count.gte=300";

                    tasks.Add(_retryPolicy.ExecuteAsync(() => httpClient.GetAsync(url)));
                }
            }
            else
            {
                // Default: fetch multi-category (popular, top_rated, now_playing)
                var endpoints = new[] { "movie/popular", "movie/top_rated", "movie/now_playing" };
                foreach (var endpoint in endpoints)
                {
                    for (int i = 1; i <= 3; i++)
                    {
                        var page = i;
                        var ep = endpoint;
                        tasks.Add(_retryPolicy.ExecuteAsync(() =>
                            httpClient.GetAsync($"{ep}?api_key={_tmdbSettings.ApiKey}&page={page}")));
                    }
                }
            }

            var responses = await Task.WhenAll(tasks);

            foreach (var response in responses)
            {
                if (!response.IsSuccessStatusCode)
                    continue;

                var content = await response.Content.ReadAsStringAsync();
                using JsonDocument doc = JsonDocument.Parse(content);
                var root = doc.RootElement;

                if (!root.TryGetProperty("results", out var resultsElement))
                    continue;

                foreach (var result in resultsElement.EnumerateArray())
                {
                    try
                    {
                        var genreNames = new List<string>();
                        if (result.TryGetProperty("genre_ids", out var gIds) && gIds.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var idElem in gIds.EnumerateArray())
                            {
                                if (idElem.TryGetInt32(out var idVal) && TmdbGenreMap.TryGetValue(idVal, out var gName))
                                {
                                    genreNames.Add(gName);
                                }
                            }
                        }

                        var movie = new Movie
                        {
                            Source = MovieSource.TMDB,
                            ExternalId = result.GetProperty("id").GetInt32().ToString(),
                            Name = result.GetProperty("title").GetString(),
                            Description = result.GetProperty("overview").GetString(),
                            Genre = genreNames.Count > 0 ? string.Join(", ", genreNames) : genre,
                            ImagePath = result.GetProperty("poster_path").GetString() != null
                                ? $"{_tmdbSettings.ImageBaseUrl}w500{result.GetProperty("poster_path").GetString()}"
                                : null,
                            BackdropPath = result.GetProperty("backdrop_path").GetString() != null
                                ? $"{_tmdbSettings.ImageBaseUrl}original{result.GetProperty("backdrop_path").GetString()}"
                                : null,
                            ReleaseDate = DateTime.TryParse(result.TryGetProperty("release_date", out var rd) ? rd.GetString() : null, out var date) 
                                ? DateTime.SpecifyKind(date, DateTimeKind.Utc) 
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
            }

            _logger.LogInformation("Successfully parsed {Count} TMDB movies", movies.Count);
            return movies.DistinctBy(m => m.ExternalId).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching TMDB movies");
            return Enumerable.Empty<Movie>();
        }
    }

    public async Task<IEnumerable<Movie>> GetPopularTmdbTvShowsAsync(string? genre = null, string? sortBy = null)
    {
        using var httpClient = _httpClientFactory.CreateClient("TMDB");

        try
        {
            var tvShows = new List<Movie>();
            var tasks = new List<Task<HttpResponseMessage>>();

            int? genreId = null;
            if (!string.IsNullOrEmpty(genre) && TvGenreToIdMap.TryGetValue(genre, out var gId))
            {
                genreId = gId;
            }

            string tmdbSort = sortBy switch
            {
                "rated" => "vote_average.desc",
                "newest" => "first_air_date.desc",
                _ => "popularity.desc"
            };

            if (genreId.HasValue || (sortBy != null && sortBy != "popular"))
            {
                for (int page = 1; page <= 4; page++)
                {
                    var p = page;
                    var url = $"discover/tv?api_key={_tmdbSettings.ApiKey}&page={p}&sort_by={tmdbSort}";
                    if (genreId.HasValue) url += $"&with_genres={genreId.Value}";
                    if (sortBy == "rated") url += "&vote_count.gte=150";

                    tasks.Add(_retryPolicy.ExecuteAsync(() => httpClient.GetAsync(url)));
                }
            }
            else
            {
                var endpoints = new[] { "tv/popular", "tv/top_rated", "tv/on_the_air" };
                foreach (var endpoint in endpoints)
                {
                    for (int i = 1; i <= 3; i++)
                    {
                        var page = i;
                        var ep = endpoint;
                        tasks.Add(_retryPolicy.ExecuteAsync(() =>
                            httpClient.GetAsync($"{ep}?api_key={_tmdbSettings.ApiKey}&page={page}")));
                    }
                }
            }

            var responses = await Task.WhenAll(tasks);

            foreach (var response in responses)
            {
                if (!response.IsSuccessStatusCode)
                    continue;

                var content = await response.Content.ReadAsStringAsync();
                using JsonDocument doc = JsonDocument.Parse(content);
                var root = doc.RootElement;

                if (!root.TryGetProperty("results", out var resultsElement))
                    continue;

                foreach (var result in resultsElement.EnumerateArray())
                {
                    try
                    {
                        var genreNames = new List<string>();
                        if (result.TryGetProperty("genre_ids", out var gIds) && gIds.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var idElem in gIds.EnumerateArray())
                            {
                                if (idElem.TryGetInt32(out var idVal) && TmdbGenreMap.TryGetValue(idVal, out var gName))
                                {
                                    genreNames.Add(gName);
                                }
                            }
                        }

                        var tvName = result.TryGetProperty("name", out var n) ? n.GetString() : "Untitled Series";
                        var tvShow = new Movie
                        {
                            Source = MovieSource.TMDB,
                            ExternalId = $"tv_{result.GetProperty("id").GetInt32()}",
                            Name = tvName ?? "Untitled Series",
                            Description = result.TryGetProperty("overview", out var ov) ? ov.GetString() : "",
                            Genre = genreNames.Count > 0 ? string.Join(", ", genreNames) : (genre ?? "TV Series"),
                            ImagePath = result.TryGetProperty("poster_path", out var p) && p.GetString() != null
                                ? $"{_tmdbSettings.ImageBaseUrl}w500{p.GetString()}"
                                : null,
                            BackdropPath = result.TryGetProperty("backdrop_path", out var b) && b.GetString() != null
                                ? $"{_tmdbSettings.ImageBaseUrl}original{b.GetString()}"
                                : null,
                            ReleaseDate = DateTime.TryParse(result.TryGetProperty("first_air_date", out var rd) ? rd.GetString() : null, out var date) 
                                ? DateTime.SpecifyKind(date, DateTimeKind.Utc) 
                                : null,
                            AverageRating = (double)(result.TryGetProperty("vote_average", out var va) ? va.GetDecimal() : 0),
                            ExternalUrl = $"https://www.themoviedb.org/tv/{result.GetProperty("id").GetInt32()}",
                            Tags = new List<Tag>(),
                            Ratings = new List<MovieRating>(),
                            Comments = new List<Comment>(),
                            Favorites = new List<Favorite>(),
                            Watchlists = new List<WatchList>()
                        };
                        tvShows.Add(tvShow);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Error parsing TMDB TV result");
                    }
                }
            }

            _logger.LogInformation("Successfully parsed {Count} TMDB TV shows", tvShows.Count);
            return tvShows.DistinctBy(m => m.ExternalId).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching TMDB TV shows");
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

    public async Task<Movie> AddManualMovieAsync(Movie movie, string userId, bool isAdmin)
    {
        movie.Source = MovieSource.UserImport;
        movie.AddedByUserId = userId;
        movie.DateAdded = DateTime.UtcNow;
        movie.IsApproved = isAdmin;

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
        var existingMovie = await _context.Movies
            .FirstOrDefaultAsync(m => m.Source == MovieSource.TMDB && m.ExternalId == tmdbId.ToString());

        if (existingMovie != null)
        {
            _logger.LogInformation("Movie {TmdbId} already exists in local DB. Returning existing.", tmdbId);
            return existingMovie;
        }

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

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var tmdbMovie = JsonSerializer.Deserialize<TmdbMovieDetails>(content, options)
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
                ReleaseDate = DateTime.TryParse(tmdbMovie.ReleaseDate, out var date) ? DateTime.SpecifyKind(date, DateTimeKind.Utc) : null,
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
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var tmdbResults = JsonSerializer.Deserialize<TmdbSearchResponse>(content, options);

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
                ReleaseDate = DateTime.TryParse(m.ReleaseDate, out var date) ? DateTime.SpecifyKind(date, DateTimeKind.Utc) : null,
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
                .Where(m => m.IsApproved && Microsoft.EntityFrameworkCore.EF.Functions.ILike(m.Name, $"%{query}%"))
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

    public async Task<IEnumerable<Movie>> GetPendingMoviesAsync()
    {
        return await _context.Movies
            .Where(m => !m.IsApproved)
            .OrderByDescending(m => m.DateAdded)
            .ToListAsync();
    }

    public async Task ApproveMovieAsync(int id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie != null)
        {
            movie.IsApproved = true;
            await _context.SaveChangesAsync();
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