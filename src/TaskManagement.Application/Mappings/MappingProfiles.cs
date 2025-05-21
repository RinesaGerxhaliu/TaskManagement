using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Application.DTOs.CatetegoryDTO;
using TaskManagement.Application.DTOs.TaskDTO;
using TaskManagement.Application.DTOs.TaskItemDTO;
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
             .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
             .ForMember(dest => dest.PriorityName, opt => opt.MapFrom(src => src.Priority.Level));

            CreateMap<AddTaskItem, TaskItem>();
            CreateMap<EditTaskItem, TaskItem>();
        }
    }
}
