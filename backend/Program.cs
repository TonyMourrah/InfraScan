using InfraScan.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Ajoute les contrôleurs
builder.Services.AddControllers();

// 2. Ajoute le support Swagger 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. Configuration de la base de données SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 4.  Active le CORS pour Angular plus tard ( Partage de ressources entre origines multiples - deux local hosts) 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// 5. Configure Swagger pour le mode développement
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // C'est CA qui crée la page web visuelle
}

app.UseHttpsRedirection();

// 6. Active le CORS
app.UseCors("AllowAngular");

app.UseAuthorization();
app.MapControllers();

app.Run();