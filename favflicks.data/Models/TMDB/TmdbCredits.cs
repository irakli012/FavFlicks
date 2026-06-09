using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace favflicks.data.Models.TMDB
{
    public class TmdbCredits
    {
        [JsonPropertyName("cast")]
        public List<TmdbCast> Cast { get; set; }

        [JsonPropertyName("crew")]
        public List<TmdbCrew> Crew { get; set; }
    }
}
