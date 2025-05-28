using AutoMapper;
using TaskManagement.Application.DTOs.TagDTO;
using TaskManagement.Application.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Interfaces;

namespace TaskManagement.Application.Services
{
    public class TagService : ITagService
    {
        private readonly ITagRepository _tagRepository;
        private readonly IMapper _mapper;

        public TagService(ITagRepository tagRepository, IMapper mapper)
        {
            _tagRepository = tagRepository;
            _mapper = mapper;
        }

        public async Task<List<TagDto>> GetAllAsync()
        {
            var tags = await _tagRepository.GetAllAsync();
            return _mapper.Map<List<TagDto>>(tags);
        }

        public async Task<TagDto?> GetByIdAsync(int id)
        {
            var tag = await _tagRepository.GetByIdAsync(id);
            return _mapper.Map<TagDto?>(tag);
        }

        public async Task<TagDto> CreateAsync(AddTagDto dto)
        {
            // → Kontrolli i duplicate
            if (await _tagRepository.ExistsByNameAsync(dto.Name))
                throw new InvalidOperationException("Tag already exists");

            var tag = _mapper.Map<Tag>(dto);
            var created = await _tagRepository.CreateAsync(tag);
            return _mapper.Map<TagDto>(created);
        }

        public async Task<TagDto?> UpdateAsync(int id, EditTagDto dto)
        {
            var existing = await _tagRepository.GetByIdAsync(id);
            if (existing == null) return null;

            // → Kontrolli i duplicate për emër të ri
            var nameTaken = await _tagRepository.ExistsByNameAsync(dto.Name);
            if (nameTaken && !string.Equals(existing.Name, dto.Name, StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException("Tag already exists");

            _mapper.Map(dto, existing);
            var updated = await _tagRepository.UpdateAsync(id, existing);
            return _mapper.Map<TagDto?>(updated);
        }

        public async Task<TagDto?> DeleteAsync(int id)
        {
            var deleted = await _tagRepository.DeleteAsync(id);
            return _mapper.Map<TagDto?>(deleted);
        }
    }
}
