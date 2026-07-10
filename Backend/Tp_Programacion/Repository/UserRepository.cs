using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Tp_Programacion.Config;
using Tp_Programacion.Models.User;

namespace Tp_Programacion.Repository
{
    public interface IUserRepository : IRepository<User> { }
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly AppDbContext _db;
        public UserRepository(AppDbContext db) : base(db)
        {
            _db = db;
        }

        public override Task<User> GetOne(Expression<Func<User, bool>>? filter = null)
        {
            IQueryable<User> query = dbSet
                .Include(u => u.Roles);
            if (filter != null)
            {
                query = query.Where(filter);
            }
            return query.FirstOrDefaultAsync();
        }
        public override Task<List<User>> GetAll(Expression<Func<User, bool>>? filter = null)
        {
            IQueryable<User> query = dbSet
                .Include(u => u.Roles);
            if (filter != null)
            {
                query = query.Where(filter);
            }
            return query.ToListAsync();
        }
    }
}
