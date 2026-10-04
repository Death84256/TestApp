using Esebial.Codebase.Data.Models;
using Esebial.Codebase.Services.ServiceModels;
using static Esebial.Codebase.Resources.Constants.Enums;

namespace Esebial.Codebase.Services.Interfaces
{
    public interface IUserService
    {
        LoginResult AuthenticateUser(string userid, string password, ref User user);
        void AddUser(UserViewModel model);
    }
}
