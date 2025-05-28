using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Interfaces;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Repositories
{
    public class TaskItemRepository : ITaskItemRepository
    {
        private readonly TaskManagementDbContext _dbContext;

        public TaskItemRepository(TaskManagementDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<TaskItem>> GetAllByUserAsync(string userId)
        {
            return await _dbContext.Tasks
                .Include(t => t.Category)
                .Include(t => t.TaskTags)
                .ThenInclude(tt => tt.Tag)
                .Where(t => t.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await _dbContext.Tasks
                .Include(t => t.Category)
                .Include(t => t.TaskTags)
                .ThenInclude(tt => tt.Tag)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<TaskItem> CreateAsync(TaskItem taskItem)
        {
            _dbContext.Tasks.Add(taskItem);
            await _dbContext.SaveChangesAsync();

            return await _dbContext.Tasks
                .Include(t => t.Category)
                .Include(t => t.TaskTags)
                .ThenInclude(tt => tt.Tag)
                .FirstOrDefaultAsync(t => t.Id == taskItem.Id);
        }

        public async Task<TaskItem?> UpdateAsync(int id, TaskItem taskItem)
        {
            var existing = await _dbContext.Tasks.FindAsync(id);
            if (existing == null) return null;

            existing.Title = taskItem.Title;
            existing.Description = taskItem.Description;
            existing.Status = taskItem.Status;
            existing.CategoryId = taskItem.CategoryId;

            await _dbContext.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<TaskItem?> UpdateWithTagsAsync(int id, TaskItem taskItem, List<int> tagIds)
        {
            var existing = await _dbContext.Tasks
                .Include(t => t.TaskTags)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (existing == null) return null;

            existing.Title = taskItem.Title;
            existing.Description = taskItem.Description;
            existing.Status = taskItem.Status;
            existing.CategoryId = taskItem.CategoryId;

            // Optional: validate tag IDs
            var validTagIds = await _dbContext.Tags
                .Where(t => tagIds.Contains(t.Id))
                .Select(t => t.Id)
                .ToListAsync();

            existing.TaskTags.Clear();
            foreach (var tagId in validTagIds)
            {
                existing.TaskTags.Add(new TaskTag { TagId = tagId });
            }

            await _dbContext.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<TaskItem?> DeleteAsync(int id)
        {
            var task = await _dbContext.Tasks
                .Include(t => t.TaskTags)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null) return null;

            _dbContext.Tasks.Remove(task);
            await _dbContext.SaveChangesAsync();
            return task;
        }
    }
}
