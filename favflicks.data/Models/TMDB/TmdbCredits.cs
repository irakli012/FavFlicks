using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.data.Models.TMDB
{
    public class TmdbCredits
    {
        public List<TmdbCast> Cast { get; set; }
        public List<TmdbCrew> Crew { get; set; }
    }
}
