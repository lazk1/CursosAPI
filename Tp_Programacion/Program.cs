using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Tp_Programacion.Config;
using Tp_Programacion.Models.Role;
using Tp_Programacion.Repository;
using Tp_Programacion.Services;
using Tp_Programacion.Utils;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Cursos API",
        Description = "Plataforma de cursos",
        TermsOfService = new Uri("https://www.cursosAPI.com"),
    });
    
    options.OperationFilter<AuthOperationFilter>();
});



// DB
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("devConnection"));
});

//Services
builder.Services.AddScoped<CursoService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RoleService>();


// Repositories

builder.Services.AddScoped<ICursoRepository, CursoRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRepository<Role>, Repository<Role>>();

//mapper
builder.Services.AddAutoMapper(cfg => { }, typeof(Mapping));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
