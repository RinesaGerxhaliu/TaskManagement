using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Application.DTOs.TaskItemDTO
{
    public class AddTaskItem
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public int PriorityId { get; set; }
        public string Status { get; set; } = "ToDo";
    }
}
