using AutoMapper;
using Esebial.Codebase.Data.Models;
using Esebial.Codebase.Services.Interfaces;
using Esebial.Codebase.Services.ServiceModels;
using Esebial.Codebase.WebApp.Authentication;
using Esebial.Codebase.WebApp.Models;
using Esebial.Codebase.WebApp.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static Esebial.Codebase.Resources.Constants.Enums;
using Esebial.Codebase.WebApp.Extensions.Configuration;

namespace Esebial.Codebase.WebApp.Controllers
{
    /// <summary>JSON authentication endpoints used by the React clients.</summary>
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase<AccountController>
    {
        private readonly SignInManager _signInManager;
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        public AccountController(
            SignInManager signInManager,
            IHttpContextAccessor httpContextAccessor,
            ILoggerFactory loggerFactory,
            IConfiguration configuration,
            IMapper mapper,
            IUserService userService) : base(httpContextAccessor, loggerFactory, configuration, mapper)
        {
            _signInManager = signInManager;
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            User user = null;
            if (_userService.AuthenticateUser(model.UserId, model.Password, ref user) != LoginResult.Success)
                return Unauthorized(new { message = "Incorrect user ID or password." });

            await _signInManager.SignInAsync(user);

            var tokenSettings = _configuration.GetTokenAuthentication();
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(tokenSettings.SecretKey));
            var tokenOptions = TokenProviderOptionsFactory.Create(tokenSettings, signingKey);
            var tokenProvider = new TokenProvider(Options.Create(tokenOptions));
            var accessToken = tokenProvider.GetJwtSecurityToken(_signInManager.CreateClaimsIdentity(user), tokenOptions);

            return Ok(new
            {
                accessToken,
                expiresIn = (int)tokenOptions.Expiration.TotalSeconds,
                user = new { user.UserId, user.Name }
            });
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public IActionResult Register([FromBody] UserViewModel model)
        {
            try
            {
                _userService.AddUser(model);
                return StatusCode(StatusCodes.Status201Created, new { message = "Account created." });
            }
            catch (InvalidDataException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Unable to create the account." });
            }
        }

        [HttpGet("me")]
        public IActionResult CurrentUser()
        {
            return Ok(new
            {
                user = new
                {
                    UserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
                    Name = User.Identity?.Name
                }
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Signed out." });
        }
    }
}
