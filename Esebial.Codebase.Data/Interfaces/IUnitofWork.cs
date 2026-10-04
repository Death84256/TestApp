using Microsoft.EntityFrameworkCore;

namespace Esebial.Codebase.Data.Interfaces
{
    public interface IUnitofWork
    {
        /// <summary>
        /// Gets the database context
        /// </summary>
        /// <value>
        /// The database.
        /// </value>
        DbContext Database { get; }
        /// <summary>
        /// save the changes to database
        /// </summary>
        void SaveChanges();


    }
}
