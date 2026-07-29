using System.Text.RegularExpressions;

namespace InfraScan.Helpers
{
    public static class MotDePasseValidator
    {
        public static string? Valider(string password)
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