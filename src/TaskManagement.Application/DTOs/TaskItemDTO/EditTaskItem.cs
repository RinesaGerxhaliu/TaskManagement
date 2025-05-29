using System.ComponentModel.DataAnnotations;

namespace TaskManagement.Application.DTOs.TaskItemDTO
{
    public class EditTaskItem
    {
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(50, ErrorMessage = "Title cannot exceed 100 characters.")]
        public string Title { get; set; } = null!;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [RegularExpression("ToDo|InProgress|Done", ErrorMessage = "Status must be ToDo, InProgress, or Done.")]
        public string Status { get; set; } = "ToDo";

        [Required(ErrorMessage = "CategoryId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "CategoryId must be a positive number.")]
        public int CategoryId { get; set; }
    }
}
