using System.ComponentModel.DataAnnotations;

namespace TaskManagement.Application.DTOs.TagDTO
{
    public class EditTagDto
    {
        [Required]
        [StringLength(50, ErrorMessage = "Name cannot exceed 50 characters.")]
        public string Name { get; set; } = null!;
    }
}
