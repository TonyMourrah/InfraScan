import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActifService, ActifRoutier } from '../../services/actif';
import * as L from 'leaflet';

@Component({
  selector: 'app-actif-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './actif-detail.html',
  styleUrls: ['./actif-detail.scss']
})
export class ActifDetailComponent implements OnInit {
  actif: ActifRoutier | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  private map: L.Map | undefined;

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
        },
        error: (err) => {
          this.errorMessage = "Impossible de charger les détails de cet actif.";
          this.loading = false;
          console.error(err);
        }
      });
    }
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
}