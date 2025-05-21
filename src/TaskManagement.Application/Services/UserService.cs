using AutoMapper;
using Microsoft.AspNetCore.Http;
using TaskManagement.Application.DTOs.UserDTO;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Application.DTOs.UserDTO;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserService(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    // Get ALL USERS
    public async Task<List<UserDTO>> GetAllAsync()
    {
        var userList = await _userRepository.GetAllAsync();
        return _mapper.Map<List<UserDTO>>(userList);
    }

    // GET USER BY ID
    public async Task<UserDTO?> GetByIdAsync(string id)  
    {
        var user = await _userRepository.GetByIdAsync(id);
        return _mapper.Map<UserDTO>(user);
    }


    // UPDATE USER BY ID
    public async Task<UserDTO?> UpdateAsync(string id, UpdateUserRequestDTO updateUser)
    {

        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return null;

        _mapper.Map(updateUser, user);

        var updatedUser = await _userRepository.UpdateAsync(id, user);
        return _mapper.Map<UserDTO>(updatedUser);
    }

    // DELETE USER BY ID
    public async Task<UserDTO?> DeleteAsync(string id)  
    {
        var deletedUser = await _userRepository.DeleteAsync(id);
        return _mapper.Map<UserDTO>(deletedUser);
    }
}
