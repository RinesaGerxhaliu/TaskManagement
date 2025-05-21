using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Application.DTOs.UserDTO;

namespace TaskManagement.Application.Interfaces;

public interface IUserService
{
    Task<List<UserDTO>> GetAllAsync();
    Task<UserDTO?> GetByIdAsync(string userId);
    Task<UserDTO?> UpdateAsync(string userId, UpdateUserRequestDTO updateUserRequest);
    Task<UserDTO?> DeleteAsync(string userId);
}
