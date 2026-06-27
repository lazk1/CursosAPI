using AutoMapper;
using System.Net;
using Tp_Programacion.Models.Role;
using Tp_Programacion.Models.Role.Dto;
using Tp_Programacion.Repository;
using Tp_Programacion.Utils;

namespace Tp_Programacion.Services
{
    public class RoleService
    {
        private readonly IMapper _mapper;
        private readonly IRepository<Role> _repo;

        public RoleService(IMapper mapper, IRepository<Role> repo)
        {
            _mapper = mapper;
            _repo = repo;
        }

        public async Task<List<Role>> GetAll() => await _repo.GetAll();

        public async Task<Role> GetOneById(int id)
        {
            var role = await _repo.GetOne(x => x.Id == id);

            if (role == null)
            {
                throw new ErrorResponse(
                    HttpStatusCode.NotFound,
                    $"Role con ID = {id} no encontrada"
                );
            }
            return role;
        }

        public async Task<Role> GetOneByName(string name)
        {
            var role = await _repo.GetOne(x => x.Name == name);

            if (role == null)
            {
                throw new ErrorResponse(
                    HttpStatusCode.NotFound,
                    $"Role con Name = {name} no encontrado"
                );
            }
            return role;
        }

        public async Task<Role> CreateOne(RoleDTO rol)
        {
            var r = _mapper.Map<Role>(rol);
            return await _repo.CreateOne(r);
        }

        public async Task<Role> UpdateOneById(int id, RoleDTO updateDto)
        {
            var role = await GetOneById(id);

            var updated = _mapper.Map(updateDto, role);

            return await _repo.UpdateOne(updated);
        }

        public async Task DeleteOneById(int id)
        {
            var role = await GetOneById(id);
            await _repo.DeleteOne(role);
        }

        public async Task<List<Role>> GetManyByIds(List<int> ids)
        {
            if (ids.Count == 0 || ids == null)
            {
                throw new ErrorResponse(
                    HttpStatusCode.BadRequest,
                    "La lista de RolesIds no puede estar vacia"
                );
            }

            var lista = await _repo.GetAll(x => ids.Contains(x.Id));
            if (lista.Count == 0)
            {
                throw new ErrorResponse(
                    HttpStatusCode.BadRequest,
                    "No coincide ningun Id"
                );
            }
            return lista;
        }
    }
}
