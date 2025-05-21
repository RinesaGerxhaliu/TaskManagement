using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Application.DTOs.CatetegoryDTO;

namespace TaskManagement.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllAsync();
        Task<CategoryDto?> GetByIdAsync(int id);
        Task<CategoryDto> CreateAsync(AddCategory addCategory);
        Task<CategoryDto?> UpdateAsync(int id, EditCategory updateCategory);
        Task<CategoryDto?> DeleteAsync(int id);
    }
}
