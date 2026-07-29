using InfraScan.Helpers;
using Xunit;

namespace InfraScan.Tests
{
    public class MotDePasseValidatorTests
    {
        [Fact]
        public void MotDePasseValide_RetourneNull()
        {
            var resultat = MotDePasseValidator.Valider("MonMotDePasse1!");
            Assert.Null(resultat);
        }

        [Fact]
        public void MotDePasseTropCourt_RetourneErreur()
        {
            var resultat = MotDePasseValidator.Valider("Ab1!");
            Assert.Contains("8 caractères", resultat);
        }

        [Fact]
        public void MotDePasseSansMajuscule_RetourneErreur()
        {
            var resultat = MotDePasseValidator.Valider("motdepasse1!");
            Assert.Contains("majuscule", resultat);
        }

        [Fact]
        public void MotDePasseSansMinuscule_RetourneErreur()
        {
            var resultat = MotDePasseValidator.Valider("MOTDEPASSE1!");
            Assert.Contains("minuscule", resultat);
        }

        [Fact]
        public void MotDePasseSansChiffre_RetourneErreur()
        {
            var resultat = MotDePasseValidator.Valider("MotDePasse!");
            Assert.Contains("chiffre", resultat);
        }

        [Fact]
        public void MotDePasseSansCaractereSpecial_RetourneErreur()
        {
            var resultat = MotDePasseValidator.Valider("MotDePasse1");
            Assert.Contains("caractère spécial", resultat);
        }

        [Fact]
        public void MotDePasseVide_RetourneErreur()
        {
            var resultat = MotDePasseValidator.Valider("");
            Assert.NotNull(resultat);
        }
    }
}