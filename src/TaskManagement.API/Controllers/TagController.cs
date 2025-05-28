using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Interfaces;
using TaskManagement.Application.DTOs.TagDTO;

namespace TaskManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagsController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tags = await _tagService.GetAllAsync();
            return Ok(tags);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var tagDto = await _tagService.GetByIdAsync(id);
            if (tagDto == null)
                return NotFound();
            return Ok(tagDto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AddTagDto addTag)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var created = await _tagService.CreateAsync(addTag);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
            {
                // return 409 with only the simple message
                return Conflict("Tag already exists!");
            }
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] EditTagDto editTag)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updated = await _tagService.UpdateAsync(id, editTag);
                if (updated == null)
                    return NotFound();
                return Ok(updated);
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
            {
                return Conflict("Tag already exists!");
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var deleted = await _tagService.DeleteAsync(id);
            if (deleted == null)
                return NotFound();
            return Ok(deleted);
        }
    }
}
