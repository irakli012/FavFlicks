using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace favflicks.data.Models.TMDB
{
    public class TmdbMovieDetails : TmdbMovieResult
    {
        [JsonPropertyName("imdb_id")]
        public string ImdbId { get; set; } = null!;

        [JsonPropertyName("homepage")]
        public string Homepage { get; set; } = null!;

        [JsonPropertyName("runtime")]
        public int Runtime { get; set; }

        [JsonPropertyName("genres")]
        public List<TmdbGenre> Genres { get; set; }

        [JsonPropertyName("credits")]
        public TmdbCredits Credits { get; set; }

        [JsonPropertyName("videos")]
        public TmdbVideosResponse Videos { get; set; } = new();
    }
}
