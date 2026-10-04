using Esebial.Codebase.Data;
using Esebial.Codebase.Data.Interfaces;
using Esebial.Codebase.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace Esebial.Codebase.Data.Repositories
{
    public class BaseRepository
    {
        protected IUnitofWork UnitOfWork { get; set; }

        protected CodebaseDbContext Context => (CodebaseDbContext)UnitOfWork.Database;

        public BaseRepository(IUnitofWork unitOfWork)
        {
            if (unitOfWork == null) throw new ArgumentNullException(nameof(unitOfWork));
            UnitOfWork = unitOfWork;
        }

        protected virtual DbSet<TEntity> GetDbSet<TEntity>() where TEntity : class
        {
            return Context.Set<TEntity>();
        }

        protected virtual void SetEntityState(object entity, EntityState entityState)
        {
            Context.Entry(entity).State = entityState;
        }
    }
}
