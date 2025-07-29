using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.data.Models.TMDB
{
    public class TmdbSearchResponse
    {
        public List<TmdbMovieResult> Results { get; set; }
    }
}
