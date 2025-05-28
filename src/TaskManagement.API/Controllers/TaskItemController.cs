using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagement.Application.DTOs.TaskItemDTO;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskItemController : ControllerBase
    {
        private readonly ITaskItemService _taskService;

        public TaskItemController(ITaskItemService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAllByUser(string userId)
        {
            var tasks = await _taskService.GetAllByUserAsync(userId);
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _taskService.GetByIdAsync(id);
            if (task == null)
                return NotFound("Task not found.");
            return Ok(task);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] AddTaskItem addTaskItem)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("User ID not found.");

            try
            {
                var created = await _taskService.CreateAsync(addTaskItem, userId);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
            {
                return Conflict("Task already exists.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EditTaskItem editTaskItem)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updated = await _taskService.UpdateAsync(id, editTaskItem);
                if (updated == null)
                    return NotFound("Task not found.");
                return Ok(updated);
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
            {
                return Conflict("Task already exists.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _taskService.DeleteAsync(id);
            if (deleted == null)
                return NotFound("Task not found.");
            return Ok(deleted);
        }
    }
}
