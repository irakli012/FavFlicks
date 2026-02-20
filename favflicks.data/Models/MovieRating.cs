using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using favflicks.data.Enums;
using System.Text.Json.Serialization;


namespace favflicks.data.Models
{
    public class MovieRating
    {
        public int Id { get; set; }

        public int MovieId { get; set; }
        [JsonIgnore]
        public Movie? Movie { get; set; }

        public string UserId { get; set; } = null!;
        [JsonIgnore]
        public AppUser? User { get; set; }

        public Rating Value { get; set; } // 1 to 10
    }

}
