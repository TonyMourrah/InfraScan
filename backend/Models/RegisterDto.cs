using System.ComponentModel.DataAnnotations;

namespace InfraScan.Models
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "L'identifiant est requis.")]
        [MinLength(3, ErrorMessage = "L'identifiant doit contenir au moins 3 caractères.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le mot de passe est requis.")]
        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "Inspecteur";
    }
}