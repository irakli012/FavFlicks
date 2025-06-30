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
    public class TagService(AppDbContext context) : ITagService
    {
        public async Task<IEnumerable<Tag>> GetAllAsync()
        {
            return await context.Tags.ToListAsync();
        }

        public async Task<Tag?> GetByIdAsync(int id)
        {
            return await context.Tags.FindAsync(id);
        }

        public async Task AddAsync(Tag tag)
        {
            context.Tags.Add(tag);
            await context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Tag tag)
        {
            var existing = await context.Tags.FindAsync(tag.Id);
            if (existing == null)
                return;

            existing.Name = tag.Name;
            await context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var tag = await context.Tags.FindAsync(id);
            if (tag != null)
            {
                context.Tags.Remove(tag);
                await context.SaveChangesAsync();
            }
        }
    }
}
