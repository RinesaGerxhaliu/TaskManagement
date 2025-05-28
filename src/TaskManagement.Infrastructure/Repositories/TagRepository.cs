using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;
using TaskManagement.Domain.Interfaces;

namespace TaskManagement.Infrastructure.Repositories
{
    public class TagRepository : ITagRepository
    {
        private readonly TaskManagementDbContext _ctx;
        public TagRepository(TaskManagementDbContext ctx) => _ctx = ctx;

        public async Task<bool> ExistsByNameAsync(string name) =>
        await _ctx.Tags.AnyAsync(t => t.Name == name);
        public async Task<List<Tag>> GetAllAsync() =>
            await _ctx.Tags.AsNoTracking().ToListAsync();

        public async Task<Tag?> GetByIdAsync(int id) =>
            await _ctx.Tags.FindAsync(id);

        public async Task<Tag> CreateAsync(Tag tag)
        {
            _ctx.Tags.Add(tag);
            await _ctx.SaveChangesAsync();
            return tag;
        }

        public async Task<Tag?> UpdateAsync(int id, Tag tag)
        {
            var existing = await _ctx.Tags.FindAsync(id);
            if (existing is null) return null;
            existing.Name = tag.Name;
            await _ctx.SaveChangesAsync();
            return existing;
        }

        public async Task<Tag?> DeleteAsync(int id)
        {
            var tag = await _ctx.Tags.FindAsync(id);
            if (tag is null) return null;
            _ctx.Tags.Remove(tag);
            await _ctx.SaveChangesAsync();
            return tag;
        }
    }
}
