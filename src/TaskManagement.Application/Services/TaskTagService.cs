using AutoMapper;
using TaskManagement.Application.DTOs.TaskTagDTO;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Interfaces;

namespace TaskManagement.Application.Services
{
    public class TaskTagService : ITaskTagService
    {
        private readonly ITaskTagRepository _repo;
        private readonly IMapper _mapper;

        public TaskTagService(ITaskTagRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<List<TaskTagDto>> GetAllByTaskAsync(int taskItemId)
        {
            var entities = await _repo.GetAllByTaskAsync(taskItemId);
            return _mapper.Map<List<TaskTagDto>>(entities);
        }

        public async Task<TaskTagDto?> GetByIdsAsync(int taskItemId, int tagId)
        {
            var entity = await _repo.GetByIdsAsync(taskItemId, tagId);
            return _mapper.Map<TaskTagDto?>(entity);
        }

        public async Task<TaskTagDto> CreateAsync(int taskItemId, AddTaskTagDto dto)
        {
            var entity = new TaskTag
            {
                TaskItemId = taskItemId,
                TagId = dto.TagId
            };

            var created = await _repo.CreateAsync(entity);
            return _mapper.Map<TaskTagDto>(created);
        }

        public async Task<TaskTagDto?> DeleteAsync(int taskItemId, int tagId)
        {
            var deleted = await _repo.DeleteAsync(taskItemId, tagId);
            return _mapper.Map<TaskTagDto?>(deleted);
        }
    }
}
