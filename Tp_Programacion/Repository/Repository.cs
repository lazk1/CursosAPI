using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Tp_Programacion.Config;

namespace Tp_Programacion.Repository
{
        public interface IRepository<T> where T : class
        {
            Task<List<T>> GetAll(Expression<Func<T, bool>>? filter = null);
            Task<T> GetOne(Expression<Func<T, bool>>? filter = null);
            Task<T> UpdateOne(T entity);
            Task<T> CreateOne(T entity);
            Task DeleteOne(T entity);
            Task Save();
        }

        public class Repository<T> : IRepository<T> where T : class
        {
            private AppDbContext _db;
            internal DbSet<T> dbSet;
            public Repository(AppDbContext db)
            {
                _db = db;
                dbSet = _db.Set<T>();
            }

            public async Task<T> CreateOne(T entity)
            {
                await dbSet.AddAsync(entity);
                await Save();
                return entity;
            }

            public async Task DeleteOne(T entity)
            {
                dbSet.Remove(entity);
                await Save();
            }

            public async Task<T> UpdateOne(T entity)
            {
                dbSet.Update(entity);
                await Save();
                return entity;
            }

            public async Task<List<T>> GetAll(Expression<Func<T, bool>>? filter = null)
            {
                IQueryable<T> query = dbSet;
                if (filter != null)
                {
                    query = query.Where(filter);
                }
                return await query.ToListAsync();
            }

            public async Task<T> GetOne(Expression<Func<T, bool>>? filter = null)
            {
                IQueryable<T> query = dbSet;
                if (filter != null)
                {
                    query = query.Where(filter);
                }
                return await query.FirstOrDefaultAsync();
            }

            public async Task Save()
            {
                await _db.SaveChangesAsync();
            }
        }
}
