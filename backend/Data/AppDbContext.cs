using InfraScan.Models;
using Microsoft.EntityFrameworkCore;

namespace InfraScan.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //  lignes qui créer les tables dans SQL Server
        public DbSet<ActifRoutier> Actifs { get; set; }

        public DbSet<Utilisateur> Utilisateurs { get; set; }
    }
}
