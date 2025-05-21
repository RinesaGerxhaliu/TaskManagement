using TaskManagement.Domain.Entities;

namespace TaskManagement.Domain.Interfaces
{
    public interface ITaskTagRepository
    {
        Task<List<TaskTag>> GetAllByTaskAsync(int taskItemId);
        Task<TaskTag?> GetByIdsAsync(int taskItemId, int tagId);
        Task<TaskTag> CreateAsync(TaskTag taskTag);
        Task<TaskTag?> DeleteAsync(int taskItemId, int tagId);
    }
}
