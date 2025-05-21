using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Application.DTOs.TaskDTO;

namespace TaskManagement.Application.DTOs.CatetegoryDTO
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public List<TaskItemDto> Tasks { get; set; } = new List<TaskItemDto>();
    }
}
