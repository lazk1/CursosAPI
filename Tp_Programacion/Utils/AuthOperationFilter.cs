using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Tp_Programacion.Utils
{
    public class AuthOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var Attributes = context.ApiDescription.CustomAttributes();
            bool isAuthorize = Attributes.Any(attr => attr.GetType() == typeof(AuthorizeAttribute));
            bool isAllowAnonymous = Attributes.Any(attr => attr.GetType() == typeof(AllowAnonymousAttribute));

            if (!isAuthorize || isAllowAnonymous) return;

            operation.Security = new List<OpenApiSecurityRequirement> {
                new OpenApiSecurityRequirement
                {
                    [
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "token" }
                        }
                    ] = new string[] {}
                }
            };
        }
    }
}
