using TaskManagement.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.DTOs.UserDTO;
using System.Security.Claims;

namespace TaskManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // Get all users
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var usersList = await _userService.GetAllAsync();
            return Ok(usersList);
        }

        // Get user by ID
        [HttpGet("byid")]
        public async Task<IActionResult> GetById()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(id))
            {
                return Unauthorized();
            }

            var userDTO = await _userService.GetByIdAsync(id);
            if (userDTO == null)
            {
                return NotFound();
            }
            return Ok(userDTO);
        }

        // Update user by ID
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateUserRequestDTO updateUser)
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(id))
            {
                return Unauthorized();
            }

            var updatedUser = await _userService.UpdateAsync(id, updateUser);
            if (updatedUser == null)
            {
                return NotFound();
            }
            return Ok(updatedUser);
        }

        // Delete user by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var deletedUser = await _userService.DeleteAsync(id);
            if (deletedUser == null)
            {
                return NotFound();
            }
            return Ok(deletedUser);
        }
    }
}
