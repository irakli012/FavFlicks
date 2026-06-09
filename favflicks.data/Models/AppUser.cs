using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace favflicks.data.Models
{
    public class AppUser : IdentityUser
    {
        public ICollection<Movie> Movies { get; set; } = new List<Movie>();
        public ICollection<MovieRating> Ratings { get; set; } = new List<MovieRating>();
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<WatchList> watchLists { get; set; } = new List<WatchList>();
        public UserProfile? Profile { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<UserList> Lists { get; set; } = new List<UserList>();
        public ICollection<WatchWith> InitiatedWatchWiths { get; set; } = new List<WatchWith>();
        public ICollection<WatchWith> TargetWatchWiths { get; set; } = new List<WatchWith>();
        public ICollection<Friendship> SentFriendRequests { get; set; } = new List<Friendship>();
        public ICollection<Friendship> ReceivedFriendRequests { get; set; } = new List<Friendship>();
    }
}
