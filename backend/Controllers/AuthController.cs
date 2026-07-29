using InfraScan.Data;
using InfraScan.Helpers;
using InfraScan.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InfraScan.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            var existeDeja = _context.Utilisateurs.Any(u => u.Username == dto.Username);
            if (existeDeja)
            {
                return BadRequest(new { message = "Cet identifiant est déjà utilisé." });
            }

            var erreurMotDePasse = MotDePasseValidator.Valider(dto.Password);
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

            var token = GenererJwt(user);

            return Ok(new { Token = token, Username = user.Username, Role = user.Role });
        }

        private string GenererJwt(Utilisateur user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role ?? "Inspecteur")
            };

            var cle = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));
            var credentials = new SigningCredentials(cle, SecurityAlgorithms.HmacSha256);

            var duree = int.Parse(_configuration["Jwt:DureeValiditeMinutes"] ?? "120");

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(duree),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}