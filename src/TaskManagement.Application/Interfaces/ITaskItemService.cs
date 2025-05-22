using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Application.DTOs.TaskDTO;
using TaskManagement.Application.DTOs.TaskItemDTO;

namespace TaskManagement.Application.Interfaces
{
    public interface ITaskItemService
    {
        Task<List<TaskItemDto>> GetAllByUserAsync(string userId);
        Task<TaskItemDto?> GetByIdAsync(int id);
        Task<TaskItemDto> CreateAsync(AddTaskItem addTask);
        Task<TaskItemDto?> UpdateAsync(int id, EditTaskItem editTask);
        Task<TaskItemDto?> DeleteAsync(int id);
    }
}
