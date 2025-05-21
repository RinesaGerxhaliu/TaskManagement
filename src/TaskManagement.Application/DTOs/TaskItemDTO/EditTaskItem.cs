using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Application.DTOs.TaskItemDTO
{
    public class EditTaskItem
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Status { get; set; } = "ToDo";

        public int CategoryId { get; set; }

    }
}
