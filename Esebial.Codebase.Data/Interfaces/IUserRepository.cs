using Esebial.Codebase.Data.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Esebial.Codebase.Data.Interfaces
{
    public interface IUserRepository
    {
        IQueryable<User> GetUsers();
        bool UserExists(string userId);
        void AddUser(User user);
    }
}
