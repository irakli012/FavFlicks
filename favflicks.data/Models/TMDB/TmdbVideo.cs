using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.data.Models.TMDB
{
    public class TmdbVideo
    {
        public string Key { get; set; } = null!;
        public string Site { get; set; } = null!;
        public string Type { get; set; } = null!;
    }
}
