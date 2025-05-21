using TaskManagement.Application.DTOs.TaskTagDTO;

namespace TaskManagement.Application.Interfaces
{
    public interface ITaskTagService
    {
        Task<List<TaskTagDto>> GetAllByTaskAsync(int taskItemId);
        Task<TaskTagDto?> GetByIdsAsync(int taskItemId, int tagId);
        Task<TaskTagDto> CreateAsync(int taskItemId, AddTaskTagDto dto);
        Task<TaskTagDto?> DeleteAsync(int taskItemId, int tagId);
    }
}
