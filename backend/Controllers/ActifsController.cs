using InfraScan.Data;
using InfraScan.Models;
using InfraScan.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfraScan.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ActifsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly BlobService _blobService;

    public ActifsController(AppDbContext context, BlobService blobService)
    {
        _context = context;
        _blobService = blobService;
    }

    // GET: api/actifs
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ActifRoutier>>> GetActifs()
    {
        return await _context.Actifs.ToListAsync();
    }

    // POST: api/actifs
    [HttpPost]
    public async Task<ActionResult<ActifRoutier>> PostActif(ActifRoutier actif)
    {
        actif.Id = 0;
        actif.DateCreation = DateTime.UtcNow;

        _context.Actifs.Add(actif);
        await _context.SaveChangesAsync();

        // Première ligne d'historique : la création
        _context.ActifHistoriques.Add(new ActifHistorique
        {
            ActifId = actif.Id,
            EtatSante = actif.EtatSante,
            DateEnregistrement = actif.DateCreation,
            ModifiePar = actif.CreePar ?? "Inconnu",
            Action = "Création"
        });
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetActif), new { id = actif.Id }, actif);
    }

    // GET: api/actifs/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ActifRoutier>> GetActif(int id)
    {
        var actif = await _context.Actifs.FindAsync(id);

        if (actif == null)
        {
            return NotFound(new { message = $"L'actif avec l'ID {id} n'existe pas." });
        }

        return actif;
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActif(int id)
    {
        var actif = await _context.Actifs.FindAsync(id);

        if (actif == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(actif.ImageUrl))
        {
            await _blobService.SupprimerImageAsync(actif.ImageUrl);
        }

        // Nettoie aussi l'historique associé
        var historiques = _context.ActifHistoriques.Where(h => h.ActifId == id);
        _context.ActifHistoriques.RemoveRange(historiques);

        _context.Actifs.Remove(actif);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/actifs/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutActif(int id, ActifRoutier actifModifie)
    {
        if (id != actifModifie.Id)
        {
            return BadRequest("L'ID ne correspond pas.");
        }

        var actifExistant = await _context.Actifs.FindAsync(id);
        if (actifExistant == null)
        {
            return NotFound();
        }

        actifExistant.Nom = actifModifie.Nom;
        actifExistant.Type = actifModifie.Type;
        actifExistant.Ville = actifModifie.Ville;
        actifExistant.Latitude = actifModifie.Latitude;
        actifExistant.Longitude = actifModifie.Longitude;
        actifExistant.EtatSante = actifModifie.EtatSante;
        actifExistant.DerniereInspection = actifModifie.DerniereInspection;

        actifExistant.ModifiePar = actifModifie.ModifiePar;
        actifExistant.DateModification = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Nouvelle ligne d'historique à chaque modification
        _context.ActifHistoriques.Add(new ActifHistorique
        {
            ActifId = id,
            EtatSante = actifExistant.EtatSante,
            DateEnregistrement = actifExistant.DateModification.Value,
            ModifiePar = actifExistant.ModifiePar ?? "Inconnu",
            Action = "Modification"
        });
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/actifs/5/historique
    [HttpGet("{id}/historique")]
    public async Task<ActionResult<IEnumerable<ActifHistorique>>> GetHistorique(int id)
    {
        var historique = await _context.ActifHistoriques
            .Where(h => h.ActifId == id)
            .OrderBy(h => h.DateEnregistrement)
            .ToListAsync();

        return historique;
    }

    // POST: api/actifs/5/image
    [HttpPost("{id}/image")]
    public async Task<IActionResult> UploaderImage(int id, IFormFile fichier)
    {
        var actif = await _context.Actifs.FindAsync(id);
        if (actif == null)
        {
            return NotFound(new { message = $"L'actif avec l'ID {id} n'existe pas." });
        }

        if (fichier == null || fichier.Length == 0)
        {
            return BadRequest(new { message = "Aucun fichier reçu." });
        }

        var extensionsPermises = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(fichier.FileName).ToLowerInvariant();
        if (!extensionsPermises.Contains(extension))
        {
            return BadRequest(new { message = "Seuls les fichiers JPG, PNG et WEBP sont acceptés." });
        }

        if (fichier.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "L'image ne doit pas dépasser 5 MB." });
        }

        if (!string.IsNullOrEmpty(actif.ImageUrl))
        {
            await _blobService.SupprimerImageAsync(actif.ImageUrl);
        }

        var nouvelleUrl = await _blobService.UploaderImageAsync(fichier);
        actif.ImageUrl = nouvelleUrl;
        await _context.SaveChangesAsync();

        return Ok(new { imageUrl = nouvelleUrl });
    }
}