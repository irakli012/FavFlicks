using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.data.Models.TMDB
{
    public class TmdbMovieDetails : TmdbMovieResult
    {
        public string ImdbId { get; set; } = null!;
        public string Homepage { get; set; } = null!;
        public int Runtime { get; set; }
        public List<TmdbGenre> Genres { get; set; }
        public TmdbCredits Credits { get; set; }

        public TmdbVideosResponse Videos { get; set; } = new();
    }
}
