namespace InfraScan.Models
{
    public class ActifRoutier
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; //  Pont, Viaduc, Tunnel
        public string Ville { get; set; } = string.Empty;
        public double Latitude { get; set; } // Pour la géomatique
        public double Longitude { get; set; }
        public int EtatSante { get; set; } // Score de 1 à 100
        public DateTime DerniereInspection { get; set; }
    }
}
