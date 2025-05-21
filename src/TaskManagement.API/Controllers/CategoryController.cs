using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagement.Application.Interfaces;
using TaskManagement.Application.DTOs.CatetegoryDTO;

namespace TaskManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET ALL CATEGORIES
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(categories);
        }

        // GET CATEGORY BY ID
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var categoryDTO = await _categoryService.GetByIdAsync(id);
            if (categoryDTO == null)
                return NotFound();
            return Ok(categoryDTO);
        }

        // CREATE CATEGORY
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AddCategory addCategory)
        {
            var createdCategory = await _categoryService.CreateAsync(addCategory);
            return CreatedAtAction(nameof(GetById), new { id = createdCategory.Id }, createdCategory);
        }

        // UPDATE CATEGORY BY ID
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] EditCategory updateCategory)
        {
            var updatedCategory = await _categoryService.UpdateAsync(id, updateCategory);
            if (updatedCategory == null)
                return NotFound();
            return Ok(updatedCategory);
        }

        // DELETE CATEGORY BY ID
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var deletedCategory = await _categoryService.DeleteAsync(id);
            if (deletedCategory == null)
                return NotFound();
            return Ok(deletedCategory);
        }
    }
}
