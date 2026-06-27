using Tp_Programacion.Models.Curso;
using Tp_Programacion.Models.Curso.Dto;
using AutoMapper;

namespace Tp_Programacion.Config
{
    public class Mapping :Profile
    {
        public Mapping() { 
            // Curso
             CreateMap<Curso, CursoDTO>().ReverseMap();
             CreateMap<CursosDTO, Curso>().ReverseMap(); // si CursosDTO es para listas
             CreateMap<CreateCursoDTO, Curso>().ReverseMap();
             CreateMap<UpdateCursoDTO, Curso>()
            .ForAllMembers(cfg => cfg.Condition((_, _, value) => value != null));
        }
    }
}
