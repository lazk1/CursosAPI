using Tp_Programacion.Config;
using Tp_Programacion.Models.Curso;
using static Tp_Programacion.Repository.UserRepository;

namespace Tp_Programacion.Repository
{
    public interface ICursoRepository : IRepository<Curso> { }
    public class CursoRepository : Repository<Curso>, ICursoRepository
    {
        private readonly AppDbContext _db;
        public CursoRepository(AppDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
