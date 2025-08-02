using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.data.Models.TMDB
{
    public class TmdbSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        public string BaseUrl { get; set; } = string.Empty;
        public string ImageBaseUrl { get; set; } = string.Empty;
    }
}
