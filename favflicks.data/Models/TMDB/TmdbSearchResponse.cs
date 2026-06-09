using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace favflicks.data.Models.TMDB
{
    public class TmdbSearchResponse
    {
        [JsonPropertyName("results")]
        public List<TmdbMovieResult> Results { get; set; }
    }
}
