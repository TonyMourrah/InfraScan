using InfraScan.Data;
using InfraScan.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfraScan.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("register")]
        public IActionResult Register([FromBody] Utilisateur nouvelUser)
        {
            var existeDeja = _context.Utilisateurs.Any(u => u.Username == nouvelUser.Username);
            if (existeDeja)
            {
                return BadRequest(new { message = "Cet identifiant est déjà utilisé." });
            }

            _context.Utilisateurs.Add(nouvelUser);
            _context.SaveChanges();

            return Ok(new { message = "Compte créé avec succès !" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
 
            var user = _context.Utilisateurs.FirstOrDefault(u => u.Username == dto.Username);

            if (user == null || user.PasswordHash != dto.Password)
            {
                return Unauthorized(new { message = "Identifiant ou mot de passe invalide" });
            }

            var token = Guid.NewGuid().ToString();

            return Ok(new { Token = token, Username = user.Username });
        }
    }
}