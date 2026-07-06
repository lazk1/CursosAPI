using AutoMapper;
using System.Net;
using Tp_Programacion.Models.Role;
using Tp_Programacion.Models.Role.Dto;
using Tp_Programacion.Repository;
using Tp_Programacion.Utils;
using Tp_Programacion.Models.Curso.Dto;
using Tp_Programacion.Models.Curso;

namespace Tp_Programacion.Services
{
    public class CursoService
    {
        private readonly IMapper _mapper;
        private readonly ICursoRepository _repo;
        

        public CursoService(IMapper mapper, ICursoRepository repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // accesoTotal = true cuando el usuario es Admin o Premium (ve gratis y pagos).
        // accesoTotal = false cuando es usuario Free o anónimo (ve solo los gratuitos).
        public async Task<List<CursosDTO>> GetAll(bool accesoTotal)
        {
            var lista = await _repo.GetAll();

            var cursos = _mapper.Map<List<CursosDTO>>(lista);

            foreach (var curso in cursos)
            {
                curso.TieneAcceso = accesoTotal || !curso.EsPago;
            }

            return cursos;
        }

        private async Task<Curso> _GetOneById(int id)
        {
            var curso = await _repo.GetOne(c => c.Id == id);

            if (curso == null)
            {
                throw new ErrorResponse(
                    HttpStatusCode.NotFound,
                    $"Curso con ID = {id} no encontrado"
                );
            }
            return curso;
        }

        public async Task<CursoDTO> GetOneById(int id, bool accesoTotal)
        {
            var curs = await _GetOneById(id);

            if (curs.EsPago && !accesoTotal)
            {
                throw new ErrorResponse(
                    HttpStatusCode.Forbidden,
                    "Este curso es exclusivo para usuarios Premium"
                );
            }

            var dto = _mapper.Map<CursoDTO>(curs);
            return dto;
        }

        public async Task<Curso> CreateOne(CreateCursoDTO emp)
        {
            var e = _mapper.Map<Curso>(emp);

          

            return await _repo.CreateOne(e);
        }

        public async Task<Curso> UpdateOneById(int id, UpdateCursoDTO updateDto)
        {
            var curs = await _GetOneById(id);

           

            var updated = _mapper.Map(updateDto, curs);

            return await _repo.UpdateOne(updated);
        }

        public async Task DeleteOneById(int id)
        {
            var curs = await _GetOneById(id);
            await _repo.DeleteOne(curs);
        }
    }
}
