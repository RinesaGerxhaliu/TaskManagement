using TaskManagement.Application.DTOs.TagDTO;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.DTOs.TaskTagDTO
{
    public class TaskTagDto
    {
        public int TaskItemId { get; set; }
        public int TagId { get; set; }

    }
}
