using AutoMapper;
using TaskManagement.Application.DTOs.TaskDTO;
using TaskManagement.Application.DTOs.TaskItemDTO;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Interfaces;

namespace TaskManagement.Application.Services
{
    public class TaskItemService : ITaskItemService
    {
        private readonly ITaskItemRepository _taskRepo;
        private readonly IMapper _mapper;

        public TaskItemService(ITaskItemRepository taskRepo, IMapper mapper)
        {
            _taskRepo = taskRepo;
            _mapper = mapper;
        }

        public async Task<List<TaskItemDto>> GetAllByUserAsync(string userId)
        {
            var tasks = await _taskRepo.GetAllByUserAsync(userId);
            return _mapper.Map<List<TaskItemDto>>(tasks);
        }

        public async Task<TaskItemDto?> GetByIdAsync(int id)
        {
            var task = await _taskRepo.GetByIdAsync(id);
            return task == null ? null : _mapper.Map<TaskItemDto>(task);
        }

        public async Task<TaskItemDto> CreateAsync(AddTaskItem addTask, string userId)
        {
            if (string.IsNullOrWhiteSpace(addTask.Title))
                throw new ArgumentException("Title is required");

            var entity = _mapper.Map<TaskItem>(addTask);
            entity.UserId = userId;
            entity.CreatedAt = DateTime.UtcNow;

            var created = await _taskRepo.CreateAsync(entity);
            return _mapper.Map<TaskItemDto>(created);
        }

        public async Task<TaskItemDto?> UpdateAsync(int id, EditTaskItem editTask)
        {
            var existing = await _taskRepo.GetByIdAsync(id);
            if (existing == null)
                return null;

            if (string.IsNullOrWhiteSpace(editTask.Title))
                throw new ArgumentException("Title is required");

            existing.Title = editTask.Title;
            existing.Description = editTask.Description;
            existing.Status = editTask.Status;
            existing.CategoryId = editTask.CategoryId;

            var updated = await _taskRepo.UpdateAsync(id, existing);
            return updated == null ? null : _mapper.Map<TaskItemDto>(updated);
        }

        public async Task<TaskItemDto?> DeleteAsync(int id)
        {
            var existing = await _taskRepo.GetByIdAsync(id);
            if (existing == null)
                return null;

            var deleted = await _taskRepo.DeleteAsync(id);
            return _mapper.Map<TaskItemDto?>(deleted);
        }
    }
}
