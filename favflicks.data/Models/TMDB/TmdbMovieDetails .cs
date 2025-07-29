using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.data.Models.TMDB
{
    public class TmdbMovieDetails : TmdbMovieResult
    {
        public int Runtime { get; set; }
        public List<TmdbGenre> Genres { get; set; }
        public TmdbCredits Credits { get; set; }
    }
}
