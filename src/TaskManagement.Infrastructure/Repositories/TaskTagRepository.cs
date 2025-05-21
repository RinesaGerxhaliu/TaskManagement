using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;
using TaskManagement.Domain.Interfaces;

namespace TaskManagement.Infrastructure.Repositories
{
    public class TaskTagRepository : ITaskTagRepository
    {
        private readonly TaskManagementDbContext _ctx;
        public TaskTagRepository(TaskManagementDbContext ctx) => _ctx = ctx;

        public async Task<List<TaskTag>> GetAllByTaskAsync(int taskItemId) =>
            await _ctx.TaskTags
                      .Include(tt => tt.Tag)               
                      .Where(tt => tt.TaskItemId == taskItemId)
                      .AsNoTracking()
                      .ToListAsync();

        public async Task<TaskTag?> GetByIdsAsync(int taskItemId, int tagId) =>
            await _ctx.TaskTags
                      .Include(tt => tt.Tag)               
                      .FirstOrDefaultAsync(tt =>
                          tt.TaskItemId == taskItemId &&
                          tt.TagId == tagId);


        public async Task<TaskTag> CreateAsync(TaskTag taskTag)
        {
            _ctx.TaskTags.Add(taskTag);
            await _ctx.SaveChangesAsync();
            return taskTag;
        }

        public async Task<TaskTag?> DeleteAsync(int taskItemId, int tagId)
        {
            var existing = await _ctx.TaskTags.FindAsync(taskItemId, tagId);
            if (existing == null) return null;
            _ctx.TaskTags.Remove(existing);
            await _ctx.SaveChangesAsync();
            return existing;
        }
    }
}
