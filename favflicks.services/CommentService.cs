using favflicks.data;
using favflicks.data.Models;
using favflicks.services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace favflicks.services
{
    public class CommentService(AppDbContext context) : ICommentService
    {
        public async Task<IEnumerable<Comment>> GetCommentsByMovieIdAsync(int movieId)
        {
            return await context.Comments
                .Where(c => c.MovieId == movieId)
                .Include(c => c.User)
                .ToListAsync();
        }

        public async Task<Comment?> GetCommentsByIdAsync(int id)
        {
            return await context.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task AddAsync(Comment comment)
        {
            context.Comments.Add(comment);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Comment comment)
        {
            context.Comments.Update(comment);
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var comment = await context.Comments.FindAsync(id);
            if (comment != null)
            {
                context.Comments.Remove(comment);
                await context.SaveChangesAsync();
            }
        }
    }
}
