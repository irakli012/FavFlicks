using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace favflicks.data.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;

        public int MovieId { get; set; }
        [JsonIgnore]
        public Movie? Movie { get; set; }

        public string UserId { get; set; } = null!; 
        [JsonIgnore]
        public AppUser? User { get; set; }
    }

}
