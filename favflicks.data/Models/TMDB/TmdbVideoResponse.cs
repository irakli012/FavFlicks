using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.data.Models.TMDB
{
    public class TmdbVideosResponse
    {
        public int Id { get; set; }
        public List<TmdbVideo> Results { get; set; } = new();
    }
}
