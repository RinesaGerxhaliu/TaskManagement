using TaskManagement.Application.DTOs.TagDTO;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Interfaces
{
    public interface ITagService
    {
        Task<List<TagDto>> GetAllAsync();
        Task<TagDto?> GetByIdAsync(int id);
        Task<TagDto> CreateAsync(AddTagDto tag);
        Task<TagDto?> UpdateAsync(int id, EditTagDto tag);
        Task<TagDto?> DeleteAsync(int id);
    }
}
