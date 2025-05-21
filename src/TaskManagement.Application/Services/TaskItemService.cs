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

        public async Task<List<TaskItemDto>> GetAllAsync()
        {
            var tasks = await _taskRepo.GetAllAsync();
            return _mapper.Map<List<TaskItemDto>>(tasks);
        }

        public async Task<TaskItemDto?> GetByIdAsync(int id)
        {
            var task = await _taskRepo.GetByIdAsync(id);
            return task == null ? null : _mapper.Map<TaskItemDto>(task);
        }

        public async Task<TaskItemDto> CreateAsync(AddTaskItem addTask)
        {
            var entity = _mapper.Map<TaskItem>(addTask);
            var created = await _taskRepo.CreateAsync(entity); 
            return _mapper.Map<TaskItemDto>(created);
        }

        public async Task<TaskItemDto?> UpdateAsync(int id, EditTaskItem editTask)
        {
            var entity = _mapper.Map<TaskItem>(editTask);
            var updated = await _taskRepo.UpdateAsync(id, entity); 
            return updated == null ? null : _mapper.Map<TaskItemDto>(updated);
        }

        public async Task<TaskItemDto?> DeleteAsync(int id)
        {
            var deleted = await _taskRepo.DeleteAsync(id);
            return deleted == null ? null : _mapper.Map<TaskItemDto>(deleted);
        }
    }

}
