import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActifService } from '../../services/actif';
import { AuthService } from '../../services/auth';
import { RouterModule } from '@angular/router';

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

  @ViewChild('actifForm') actifForm!: NgForm;

  constructor(private actifService: ActifService) {}

  ngOnInit(): void {
    this.chargerActifs();
  }

  username = this.authService.getUsername();

  chargerActifs() {
    this.actifService.getActifs().subscribe({
      next: (donnees) => { this.actifs = donnees; },
      error: (err) => console.error('Erreur lors du chargement', err)
    });
  }

  get filteredActifs() {
    let result = [...this.actifs];

    // 1. TRI
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

    // 2. RECHERCHE / FILTRE
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

  // STATISTIQUES
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

  // ACTIONS
  preparerAjout(): void {
    this.modeEdition = false;
    this.idEnEdition = null;
    this.actifForm.resetForm();
    setTimeout(() => {
      this.actifForm.form.patchValue({
        type: 'Pont',
        ville: 'Laval',
        latitude: 45.56,
        longitude: -73.71,
        derniereInspection: new Date().toISOString().split('T')[0],
        etatSante: 75  // ← valeur initiale pour éviter NaN sur le slider
      });
    });
  }

  preparerModification(actif: any): void {
    this.modeEdition = true;
    this.idEnEdition = actif.id;
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

 enregistrer(formValue: any): void {
    if (!this.actifForm.valid) return;

    const payload: any = {
      Nom: formValue.nom,
      Type: formValue.type,
      Ville: formValue.ville || 'Laval',
      EtatSante: Number(formValue.etatSante) || 0,
      DerniereInspection: formValue.derniereInspection,
      Latitude: Number(formValue.latitude) || 45.56,
      Longitude: Number(formValue.longitude) || -73.71
    };

    if (this.modeEdition && this.idEnEdition) {
      payload.Id = this.idEnEdition;
      this.actifService.putActif(this.idEnEdition, payload).subscribe({
        next: () => { 
          this.chargerActifs(); 
          this.fermerModal(); 
        },
        error: (err) => console.error('Erreur lors de la modification:', err)
      });
    } else {
      this.actifService.postActif(payload).subscribe({
        next: () => { 
          this.chargerActifs(); 
          this.fermerModal(); 
        },
        error: (err) => {
          alert("Erreur lors de l'ajout.");
          console.error("Détails de l'erreur POST:", err);
        }
      });
    }
  }

  supprimer(id: number, nom: string): void {
    if (confirm(`Es-tu sûr de vouloir supprimer l'actif : ${nom} ?`)) {
      this.actifService.deleteActif(id).subscribe({
        next: () => { this.actifs = this.actifs.filter(a => a.id !== id); },
        error: () => alert('Erreur lors de la suppression.')
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