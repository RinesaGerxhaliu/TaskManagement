using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Application.DTOs.CatetegoryDTO;
using TaskManagement.Application.DTOs.TagDTO;
using TaskManagement.Application.DTOs.TaskDTO;
using TaskManagement.Application.DTOs.TaskItemDTO;
using TaskManagement.Application.DTOs.TaskTagDTO;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Mappings
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<AddCategory, Category>().ReverseMap();
            CreateMap<EditCategory, Category>().ReverseMap();

            CreateMap<TaskItem, TaskItemDto>()
             .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<AddTaskItem, TaskItem>();
            CreateMap<EditTaskItem, TaskItem>();

            CreateMap<Tag, TagDto>().ReverseMap();
            CreateMap<AddTagDto, Tag>().ReverseMap();
            CreateMap<EditTagDto, Tag>().ReverseMap();

            CreateMap<TaskTag, TaskTagDto>()
               .ForMember(dest => dest.TagName, opt => opt.MapFrom(src => src.Tag.Name));

            CreateMap<AddTaskTagDto, TaskTag>()
                .ForMember(dest => dest.TagId, opt => opt.MapFrom(src => src.TagId))
                .ForMember(dest => dest.TaskItemId, opt => opt.Ignore())
                .ForMember(dest => dest.Tag, opt => opt.Ignore());
        }
    }
}
