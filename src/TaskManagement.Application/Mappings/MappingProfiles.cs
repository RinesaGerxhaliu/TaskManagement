using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskManagement.Application.DTOs.CatetegoryDTO;
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
           // CreateMap<AddCategory, Category>()
    //.ForMember(dest => dest.Tasks, opt => opt.MapFrom(src => src.Tasks));

           // CreateMap<AddTaskItem, TaskItem>();
        }
    }
}
