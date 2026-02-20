using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace favflicks.data.Models
{
    public class Favorite
    {
        public int Id { get; set; }

        public int MovieId { get; set; }
        [JsonIgnore]
        public Movie? Movie { get; set; }

        public string UserId { get; set; }
        [JsonIgnore]
        public AppUser? User { get; set; }
    }
}
