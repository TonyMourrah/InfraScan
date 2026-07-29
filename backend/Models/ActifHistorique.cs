namespace InfraScan.Models
{
    public class ActifHistorique
    {
        public int Id { get; set; }
        public int ActifId { get; set; }
        public int EtatSante { get; set; }
        public DateTime DateEnregistrement { get; set; } = DateTime.UtcNow;
        public string ModifiePar { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty; 
    }
}