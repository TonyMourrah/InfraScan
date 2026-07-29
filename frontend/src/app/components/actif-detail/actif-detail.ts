import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActifService, ActifRoutier, ActifHistorique } from '../../services/actif';
import * as L from 'leaflet';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-actif-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './actif-detail.html',
  styleUrls: ['./actif-detail.scss']
})
export class ActifDetailComponent implements OnInit {
  actif: ActifRoutier | null = null;
  historique: ActifHistorique[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  private map: L.Map | undefined;
  private chart: Chart | undefined;

  constructor(
    private route: ActivatedRoute,
    private actifService: ActifService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;

    if (id) {
      this.actifService.getActifById(id).subscribe({
        next: (data) => {
          this.actif = data;
          this.loading = false;
          this.cdr.detectChanges();
          setTimeout(() => this.initMap(), 50);
          this.chargerHistorique(id);
        },
        error: (err) => {
          this.errorMessage = "Impossible de charger les détails de cet actif.";
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  private chargerHistorique(id: number): void {
    this.actifService.getHistorique(id).subscribe({
      next: (data) => {
        this.historique = data;
        this.cdr.detectChanges();
        setTimeout(() => this.initChart(), 50);
      },
      error: (err) => {
        console.error("Erreur lors du chargement de l'historique:", err);
      }
    });
  }

  getPriorite(score: number): { texte: string, classe: string } {
    if (score < 40) return { texte: 'CRITIQUE', classe: 'bg-danger' };
    if (score < 75) return { texte: 'À SURVEILLER', classe: 'bg-warning text-dark' };
    return { texte: 'OPTIMAL', classe: 'bg-success' };
  }

  private initMap(): void {
    if (!this.actif || !this.actif.latitude || !this.actif.longitude) return;

    const container = document.getElementById('mapActif');
    if (!container) {
      console.error('Conteneur de carte introuvable dans le DOM.');
      return;
    }

    const lat = this.actif.latitude;
    const lng = this.actif.longitude;

    this.map = L.map('mapActif', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([lat, lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    L.marker([lat, lng], { icon })
      .addTo(this.map)
      .bindPopup(`<strong>${this.actif.nom}</strong><br>${this.actif.ville}`)
      .openPopup();

    setTimeout(() => this.map?.invalidateSize(), 100);
  }

  private initChart(): void {
    const canvas = document.getElementById('graphiqueSante') as HTMLCanvasElement;
    if (!canvas || this.historique.length === 0) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.historique.map(h =>
      new Date(h.dateEnregistrement).toLocaleDateString('fr-CA', { day: '2-digit', month: 'short', year: 'numeric' })
    );
    const donnees = this.historique.map(h => h.etatSante);

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Indice de santé (%)',
          data: donnees,
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          tension: 0.3,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: '#0d6efd'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: { callback: (value) => value + '%' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}