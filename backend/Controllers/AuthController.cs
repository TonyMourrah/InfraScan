using InfraScan.Data;
using InfraScan.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

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
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            
            var existeDeja = _context.Utilisateurs.Any(u => u.Username == dto.Username);
            if (existeDeja)
            {
                return BadRequest(new { message = "Cet identifiant est déjà utilisé." });
            }

            
            var erreurMotDePasse = ValiderComplexiteMotDePasse(dto.Password);
            if (erreurMotDePasse != null)
            {
                return BadRequest(new { message = erreurMotDePasse });
            }

            
            var nouvelUtilisateur = new Utilisateur
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role
            };

            _context.Utilisateurs.Add(nouvelUtilisateur);
            _context.SaveChanges();

            return Ok(new { message = "Compte créé avec succès !" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var user = _context.Utilisateurs.FirstOrDefault(u => u.Username == dto.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Identifiant ou mot de passe invalide" });
            }

            var token = Guid.NewGuid().ToString();

            return Ok(new { Token = token, Username = user.Username });
        }

        
        private string? ValiderComplexiteMotDePasse(string password)
        {
            if (string.IsNullOrEmpty(password) || password.Length < 8)
                return "Le mot de passe doit contenir au moins 8 caractères.";

            if (!Regex.IsMatch(password, @"[A-Z]"))
                return "Le mot de passe doit contenir au moins une majuscule.";

            if (!Regex.IsMatch(password, @"[a-z]"))
                return "Le mot de passe doit contenir au moins une minuscule.";

            if (!Regex.IsMatch(password, @"[0-9]"))
                return "Le mot de passe doit contenir au moins un chiffre.";

            if (!Regex.IsMatch(password, @"[\W_]"))
                return "Le mot de passe doit contenir au moins un caractère spécial (ex: !@#$%).";

            return null; 
        }
    }
}