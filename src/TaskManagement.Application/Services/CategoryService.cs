using AutoMapper;
using TaskManagement.Application.DTOs.CatetegoryDTO;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Interfaces;

namespace TaskManagement.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<List<CategoryDto>> GetAllAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return _mapper.Map<List<CategoryDto>>(categories);
        }

        public async Task<CategoryDto?> GetByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            return _mapper.Map<CategoryDto?>(category);
        }

        public async Task<CategoryDto> CreateAsync(AddCategory addCategory)
        {
            var category = _mapper.Map<Category>(addCategory);
            var createdCategory = await _categoryRepository.CreateAsync(category);
            return _mapper.Map<CategoryDto>(createdCategory);
        }

        public async Task<CategoryDto?> UpdateAsync(int id, EditCategory updateCategory)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return null;

            _mapper.Map(updateCategory, category);
            var updatedCategory = await _categoryRepository.UpdateAsync(id, category);
            return _mapper.Map<CategoryDto?>(updatedCategory);
        }

        public async Task<CategoryDto?> DeleteAsync(int id)
        {
            var deletedCategory = await _categoryRepository.DeleteAsync(id);
            return _mapper.Map<CategoryDto?>(deletedCategory);
        }
    }
}