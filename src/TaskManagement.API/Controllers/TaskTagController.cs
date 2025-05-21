using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.DTOs.TaskTagDTO;
using TaskManagement.Application.Interfaces;

namespace TaskManagement.API.Controllers
{
    [ApiController]
    [Route("api/tasks/{taskId}/tags")]
    public class TaskTagsController : ControllerBase
    {
        private readonly ITaskTagService _svc;

        public TaskTagsController(ITaskTagService svc)
        {
            _svc = svc;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromRoute] int taskId)
            => Ok(await _svc.GetAllByTaskAsync(taskId));

        [HttpGet("{tagId:int}")]
        public async Task<IActionResult> Get(
            [FromRoute] int taskId,
            [FromRoute] int tagId)
        {
            var tt = await _svc.GetByIdsAsync(taskId, tagId);
            return tt is null ? NotFound() : Ok(tt);
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromRoute] int taskId,
            [FromBody] AddTaskTagDto dto)
        {
            var created = await _svc.CreateAsync(taskId, dto);
            return CreatedAtAction(
                nameof(Get),
                new { taskId = created.TaskItemId, tagId = created.TagId },
                created
            );
        }

        [HttpDelete("{tagId:int}")]
        public async Task<IActionResult> Delete(
            [FromRoute] int taskId,
            [FromRoute] int tagId)
        {
            var deleted = await _svc.DeleteAsync(taskId, tagId);
            return deleted is null ? NotFound() : Ok(deleted);
        }
    }
}
