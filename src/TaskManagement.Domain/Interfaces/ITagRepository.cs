using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Domain.Interfaces
{
    public interface ITagRepository
    {
        Task<bool> ExistsByNameAsync(string name);
        Task<List<Tag>> GetAllAsync();
        Task<Tag?> GetByIdAsync(int id);
        Task<Tag> CreateAsync(Tag tag);
        Task<Tag?> UpdateAsync(int id, Tag tag);
        Task<Tag?> DeleteAsync(int id);
    }
}
