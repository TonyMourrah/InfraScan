using InfraScan.Data;
using InfraScan.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InfraScan.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ActifsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ActifsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/actifs (Pour lister tous les ponts/routes)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ActifRoutier>>> GetActifs()
    {
        return await _context.Actifs.ToListAsync();
    }
    // POST: api/actifs (Pour ajouter un nouvel actif)
    [HttpPost]
public async Task<ActionResult<ActifRoutier>> PostActif(ActifRoutier actif)
{
    actif.Id = 0;
    actif.DateCreation = DateTime.UtcNow;
    // CreePar arrive déjà rempli dans "actif" si le front l'envoie dans le payload

    _context.Actifs.Add(actif);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(GetActif), new { id = actif.Id }, actif);
}
    // GET: api/actifs/5 (Pour récupérer un seul actif par son ID)
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
        // cherche l'actif dans la base de données SQL
        var actif = await _context.Actifs.FindAsync(id);

        // Si l'ID n'existe pas, on le dit
        if (actif == null)
        {
            return NotFound();
        }

        //  On le supprime et on sauvegarde les changements
        _context.Actifs.Remove(actif);
        await _context.SaveChangesAsync();

        //  On renvoie un succès "No Content" (204)
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

    // On met à jour les champs métier
    actifExistant.Nom = actifModifie.Nom;
    actifExistant.Type = actifModifie.Type;
    actifExistant.Ville = actifModifie.Ville;
    actifExistant.Latitude = actifModifie.Latitude;
    actifExistant.Longitude = actifModifie.Longitude;
    actifExistant.EtatSante = actifModifie.EtatSante;
    actifExistant.DerniereInspection = actifModifie.DerniereInspection;

    // On préserve CreePar / DateCreation, on met à jour l'audit de modification
    actifExistant.ModifiePar = actifModifie.ModifiePar;
    actifExistant.DateModification = DateTime.UtcNow;

    await _context.SaveChangesAsync();
    return NoContent();
}
}