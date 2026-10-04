using AutoMapper;
using Esebial.Codebase.Data.Models;
using Esebial.Codebase.Services.ServiceModels;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Esebial.Codebase.WebApp
{
    // AutoMapper configuration
    internal partial class StartupConfigurer
    {
        /// <summary>
        /// Configure auto mapper
        /// </summary>
        private void ConfigureAutoMapper()
        {
            var loggerFactory = this._services
                .BuildServiceProvider()
                .GetRequiredService<ILoggerFactory>();

            var mapperConfiguration = new MapperConfiguration(config =>
            {
                config.AddProfile(new AutoMapperProfileConfiguration());
            }, loggerFactory);

            this._services.AddSingleton<IMapper>(
                mapperConfiguration.CreateMapper()
            );
        }

        private class AutoMapperProfileConfiguration : Profile
        {
            public AutoMapperProfileConfiguration()
            {
                CreateMap<UserViewModel, User>();
            }
        }
    }
}   
