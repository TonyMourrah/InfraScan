import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActifService } from '../../services/actif';
import { AuthService } from '../../services/auth';
import { GeocodingService } from '../../services/geocoding';
import { RouterModule } from '@angular/router';

// Coordonnées par défaut si toute géolocalisation échoue (centre  du Québec)
const COORDS_PAR_DEFAUT = { lat: 46.8139, lng: -71.2080 };

@Component({
  selector: 'app-actif-list',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, RouterModule],
  templateUrl: './actif-list.html',
  styleUrl: './actif-list.scss'
})
export class ActifListComponent implements OnInit {
  actifs: any[] = [];
  searchTerm: string = '';
  sortOrder: 'name' | 'critical' = 'name';
  modeEdition: boolean = false;
  idEnEdition: number | null = null;
  private authService = inject(AuthService);

  isLoadingListe: boolean = true;
  isSaving: boolean = false;
  isDeletingId: number | null = null;

  isGeocoding: boolean = false;
  geocodeMessage: string = '';
  geocodeMessageType: 'success' | 'warning' | '' = '';

  @ViewChild('actifForm') actifForm!: NgForm;

  constructor(
    private actifService: ActifService,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit(): void {
    this.chargerActifs();
  }

  username = this.authService.getUsername();

  chargerActifs() {
    this.isLoadingListe = true;
    this.actifService.getActifs().subscribe({
      next: (donnees) => {
        this.actifs = donnees;
        this.isLoadingListe = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement', err);
        this.isLoadingListe = false;
      }
    });
  }

  get filteredActifs() {
    let result = [...this.actifs];

    if (this.sortOrder === 'critical') {
      result.sort((a, b) => {
        const scoreA = a.etatSante ?? a.EtatSante ?? 100;
        const scoreB = b.etatSante ?? b.EtatSante ?? 100;
        return scoreA - scoreB;
      });
    } else {
      result.sort((a, b) => {
        const nomA = (a.nom || a.Nom || '').toLowerCase();
        const nomB = (b.nom || b.Nom || '').toLowerCase();
        return nomA.localeCompare(nomB);
      });
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(a => {
        const nom = (a.nom || a.Nom || '').toLowerCase();
        const ville = (a.ville || a.Ville || '').toLowerCase();
        const type = (a.type || a.Type || '').toLowerCase();
        return nom.includes(term) || ville.includes(term) || type.includes(term);
      });
    }

    return result;
  }

  get totalActifs(): number { return this.actifs.length; }

  get moyenneSante(): number {
    if (this.actifs.length === 0) return 0;
    const total = this.actifs.reduce((acc, curr) => acc + (curr.etatSante ?? curr.EtatSante ?? 0), 0);
    return Math.round(total / this.actifs.length);
  }

  get interventionsUrgentes(): number {
    return this.actifs.filter(a => (a.etatSante ?? a.EtatSante ?? 100) < 40).length;
  }

  getPriorite(score: number): { texte: string, classe: string } {
    if (score < 40) return { texte: 'CRITIQUE', classe: 'bg-danger' };
    if (score < 75) return { texte: 'À SURVEILLER', classe: 'bg-warning text-dark' };
    return { texte: 'OPTIMAL', classe: 'bg-success' };
  }

  preparerAjout(): void {
    this.modeEdition = false;
    this.idEnEdition = null;
    this.geocodeMessage = '';
    this.geocodeMessageType = '';
    this.actifForm.resetForm();
    setTimeout(() => {
      this.actifForm.form.patchValue({
        type: 'Pont',
        ville: 'Laval',
        latitude: 45.56,
        longitude: -73.71,
        derniereInspection: new Date().toISOString().split('T')[0],
        etatSante: 75
      });
    });
  }

  preparerModification(actif: any): void {
    this.modeEdition = true;
    this.idEnEdition = actif.id;
    this.geocodeMessage = '';
    this.geocodeMessageType = '';
    this.actifForm.form.patchValue({
      nom: actif.nom,
      type: actif.type,
      ville: actif.ville,
      derniereInspection: actif.derniereInspection ? actif.derniereInspection.split('T')[0] : '',
      etatSante: actif.etatSante ?? actif.EtatSante ?? 75,
      latitude: actif.latitude,
      longitude: actif.longitude
    });
  }


  localiserActif(): void {
    const nom = (this.actifForm.value.nom || '').trim();
    const ville = (this.actifForm.value.ville || '').trim();

    if (!ville || ville.length < 2) {
      this.geocodeMessage = "Entre au moins une ville avant de localiser.";
      this.geocodeMessageType = 'warning';
      return;
    }

    this.isGeocoding = true;
    this.geocodeMessage = '';

    const requetePrecise = nom ? `${nom}, ${ville}` : ville;

    this.geocodingService.rechercherAdresse(requetePrecise).subscribe({
      next: (resultats) => {
        if (resultats.length > 0) {
          this.appliquerCoordonnees(resultats[0].lat, resultats[0].lon,
            `Position précise trouvée pour "${nom || ville}".`, 'success');
          return;
        }
        // Rien trouvé avec le nom précis → on retente avec la ville seule
        if (nom) {
          this.tenterAvecVilleSeule(ville);
        } else {
          this.appliquerCoordonneesParDefaut(`"${ville}" introuvable — position approximative appliquée.`);
        }
      },
      error: () => {
        if (nom) {
          this.tenterAvecVilleSeule(ville);
        } else {
          this.appliquerCoordonneesParDefaut("Erreur de recherche — position approximative appliquée.");
        }
      }
    });
  }

  private tenterAvecVilleSeule(ville: string): void {
    this.geocodingService.rechercherAdresse(ville).subscribe({
      next: (resultats) => {
        if (resultats.length > 0) {
          this.appliquerCoordonnees(resultats[0].lat, resultats[0].lon,
            `Adresse précise introuvable — position de "${ville}" appliquée.`, 'warning');
        } else {
          this.appliquerCoordonneesParDefaut(`"${ville}" introuvable — position approximative appliquée.`);
        }
      },
      error: () => {
        this.appliquerCoordonneesParDefaut("Erreur de recherche — position approximative appliquée.");
      }
    });
  }

  private appliquerCoordonnees(lat: string, lon: string, message: string, type: 'success' | 'warning'): void {
    this.isGeocoding = false;
    this.actifForm.form.patchValue({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon)
    });
    this.geocodeMessage = message;
    this.geocodeMessageType = type;
  }

  private appliquerCoordonneesParDefaut(message: string): void {
    this.isGeocoding = false;
    this.actifForm.form.patchValue({
      latitude: COORDS_PAR_DEFAUT.lat,
      longitude: COORDS_PAR_DEFAUT.lng
    });
    this.geocodeMessage = message;
    this.geocodeMessageType = 'warning';
  }

  enregistrer(formValue: any): void {
    if (!this.actifForm.valid || this.isSaving) return;
    this.isSaving = true;

    const latitude = Number(formValue.latitude) || COORDS_PAR_DEFAUT.lat;
    const longitude = Number(formValue.longitude) || COORDS_PAR_DEFAUT.lng;

    const payload: any = {
      Nom: formValue.nom,
      Type: formValue.type,
      Ville: formValue.ville || 'Laval',
      EtatSante: Number(formValue.etatSante) || 0,
      DerniereInspection: formValue.derniereInspection,
      Latitude: latitude,
      Longitude: longitude
    };

    if (this.modeEdition && this.idEnEdition) {
      payload.Id = this.idEnEdition;
      payload.ModifiePar = this.username;

      this.actifService.putActif(this.idEnEdition, payload).subscribe({
        next: () => {
          this.chargerActifs();
          this.fermerModal();
          this.isSaving = false;
        },
        error: (err) => {
          alert("Erreur lors de la modification.");
          console.error('Erreur lors de la modification:', err);
          this.isSaving = false;
        }
      });
    } else {
      payload.CreePar = this.username;

      this.actifService.postActif(payload).subscribe({
        next: () => {
          this.chargerActifs();
          this.fermerModal();
          this.isSaving = false;
        },
        error: (err) => {
          alert("Erreur lors de l'ajout.");
          console.error("Détails de l'erreur POST:", err);
          this.isSaving = false;
        }
      });
    }
  }

  supprimer(id: number, nom: string): void {
    if (this.isDeletingId !== null) return;

    if (confirm(`Es-tu sûr de vouloir supprimer l'actif : ${nom} ?`)) {
      this.isDeletingId = id;
      this.actifService.deleteActif(id).subscribe({
        next: () => {
          this.actifs = this.actifs.filter(a => a.id !== id);
          this.isDeletingId = null;
        },
        error: () => {
          alert('Erreur lors de la suppression.');
          this.isDeletingId = null;
        }
      });
    }
  }

  private fermerModal() {
    const modalEl = document.getElementById('modalAjout');
    if (modalEl) {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap) {
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
      }
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  }

  deconnexion() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
    }
  }

  exporterCSV(): void {
    if (this.actifs.length === 0) return;

    const headers = ['ID', 'Nom', 'Type', 'Ville', 'Sante', 'Derniere Inspection'];

    const rows = this.actifs.map(a => [
      a.id,
      `"${a.nom || a.Nom || ''}"`,
      a.type || a.Type || '',
      a.ville || a.Ville || '',
      `${a.etatSante ?? a.EtatSante ?? 0}%`,
      a.derniereInspection?.split('T')[0] || ''
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(e => e.join(';'))
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rapport_InfraScan_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}