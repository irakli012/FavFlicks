using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using favflicks.data.Enums;

namespace favflicks.data.Models
{
    public class MovieRating
    {
        public int Id { get; set; }

        public int MovieId { get; set; }
        public Movie? Movie { get; set; }

        public string UserId { get; set; } = null!;
        public AppUser? User { get; set; }

        public Rating Value { get; set; } // 1 to 10
    }

}
