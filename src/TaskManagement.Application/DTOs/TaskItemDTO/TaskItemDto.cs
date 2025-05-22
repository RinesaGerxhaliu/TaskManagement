using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Application.DTOs.TaskDTO
{
    public class TaskItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Status { get; set; } = "ToDo";
        public DateTime CreatedAt { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }

        public string? UserId { get; set; }

    }
}
