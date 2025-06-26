using favflicks.data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.services.Interfaces
{
    public interface CommentService
    {
        Task<IEnumerable<Comment>> GetCommentsByMovieIdAsync(int movieId);
        Task<Comment> GetCommentsByIdAsync(int id);
        Task AddAsync(Comment comment);
        Task UpdateAsync(Comment comment);
        Task DeleteAsync(int id);
    }
}
