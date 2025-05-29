using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Application.DTOs.CatetegoryDTO
{
    public class EditCategory
    {
        [Required]
        [StringLength(70, ErrorMessage = "Name cannot exceed 50 characters.")]
        public string Name { get; set; } = null!;
    }
}
