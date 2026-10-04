using System;
using Esebial.Codebase.Data.Interfaces;
using Esebial.Codebase.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Esebial.Codebase.Data
{
    public class UnitofWork : IUnitofWork, IDisposable
    {
        /// <summary>
        /// Gets the database context
        /// </summary>
        public DbContext Database { get; private set; }

        /// <summary>
        /// Initializes a new instance of the UnitOfWork class.
        /// </summary>
        /// <param name="serviceContext">The service context.</param>
        public UnitofWork(CodebaseDbContext serviceContext)
        {
            Database = serviceContext;
        }

        /// <summary>
        /// Saves the changes to database
        /// </summary>
        public void SaveChanges()
        {
            Database.SaveChanges();
        }

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            Database.Dispose();
        }
    }
}
