using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.data.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;

        public int MovieId { get; set; }
        public Movie Movie { get; set; } = null!;

        public string UserId { get; set; } = null!; 
        public AppUser User { get; set; } = null!;
    }

}
