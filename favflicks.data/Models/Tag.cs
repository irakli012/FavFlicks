using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace favflicks.data.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        [JsonIgnore]    
        public ICollection<Movie> Movies { get; set; } = new List<Movie>();
    }
}
